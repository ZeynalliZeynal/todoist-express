import User, { UserDocument } from "../model/user.model";
import {
  admin_email,
  client_dev_origin,
  client_prod_origin,
  jwt_refresh_secret,
  jwt_verify_secret,
  node_env,
} from "../constants/env";
import Session, { SessionDocument } from "../model/session.model";
import { StatusCodes } from "http-status-codes";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  VerificationTokenPayload,
  verificationTokenSignOptions,
  verifyToken,
} from "../utils/jwt";
import AppError from "../utils/app-error";
import { sendMail } from "../utils/email";
import { otpVerificationEmail } from "../utils/email-templates";
import { addDays, addMinutes } from "date-fns";
import OTP, { OTPPurpose } from "../model/otp.model";
import crypto from "crypto";
import Plan from "../model/plan.model";
import ErrorCodes from "../constants/error-codes";
import NotificationTypeModel from "../model/notification-type.model";
import NotificationSettingsModel from "../model/notification-settings.model";

export interface CreateAccountParams {
  otp: string;
  verifyToken: string;
  // password: string;
  // confirmPassword: string;
  userAgent?: SessionDocument["userAgent"];
  location?: UserDocument["location"];
  plan: string;
}

export interface LoginParams {
  otp: string;
  verifyToken: string;
  location?: UserDocument["location"];
  userAgent?: SessionDocument["userAgent"];
}

const appOrigin =
  node_env === "development" ? client_dev_origin : client_prod_origin;

export const createEmailVerificationOTP = async (
  data: { name: string; email: string; otp: string },
  purpose: OTPPurpose
) => {
  const existingOtp = await OTP.findOne({ email: data.email, isUsed: false });

  if (existingOtp) {
    throw new AppError(
      "Email verification in progress. Please check your inbox and spam folder.",
      StatusCodes.CONFLICT,
      ErrorCodes.EMAIL_VERIFICATION_CONFLICT
    );
  }

  const otp = await OTP.create({
    email: data.email,
    otp: data.otp,
    purpose,
    expiresAt: addMinutes(Date.now(), 5),
  });

  return signToken(
    { name: data.name, email: data.email, otpId: otp._id },
    verificationTokenSignOptions
  );
};

export const sendLoginEmailVerification = async ({
  email,
}: {
  email: string;
}) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser)
    throw new AppError("Email is incorrect.", StatusCodes.NOT_FOUND);

  const otp = crypto.randomInt(100000, 999999).toString();
  const token = await createEmailVerificationOTP(
    {
      otp,
      name: existingUser.name,
      email,
    },
    OTPPurpose.EMAIL_VERIFICATION
  );

  const location = {
    city: existingUser.location.city,
    country_name: existingUser.location.country_name,
  };

  const url = `${appOrigin}/auth/login/email?token=${token}`;

  await sendMail({
    to: [email],
    ...otpVerificationEmail({
      otp,
      url,
      auth: "log in",
      username: existingUser.name,
      location,
    }),
  });

  return token;
};

export const sendSignupEmailVerification = async (
  {
    name,
    email,
  }: {
    email: string;
    name: string;
  },
  location: UserDocument["location"]
) => {
  const existingUser = await User.exists({ email });
  if (existingUser)
    throw new AppError("Email is already in use.", StatusCodes.CONFLICT);

  const otp = crypto.randomInt(100000, 999999).toString();
  const token = await createEmailVerificationOTP(
    {
      email,
      otp,
      name,
    },
    OTPPurpose.EMAIL_VERIFICATION
  );

  const url = `${appOrigin}/auth/signup/email?token=${token}`;

  await sendMail({
    to: [email],
    ...otpVerificationEmail({
      otp,
      url,
      auth: "sign up",
      username: name,
      location,
    }),
  });

  return token;
};

export const createAccount = async (data: CreateAccountParams) => {
  try {
    // verify entered email. if not verified, the error will be thrown
    const { name, email } = await verifyOTP(
      data.otp,
      data.verifyToken,
      OTPPurpose.EMAIL_VERIFICATION
    );

    const plan = await Plan.findOne({
      name: {
        $regex: data.plan,
        $options: "i",
      },
    });

    if (!plan)
      throw new AppError("Plan name is incorrect", StatusCodes.NOT_FOUND);

    const user = await User.create({
      email,
      name,
      verified: true,
      verifiedAt: new Date(),
      location: data.location,
      role: admin_email === email ? "admin" : "user",
      plan: plan._id,
    });

    const notificationTypes = await NotificationTypeModel.find();

    await NotificationSettingsModel.create({
      user: user._id,
      preferences: notificationTypes.map((type) => ({
        type: type._id,
        enabled: true,
      })),
    });

    // create session
    const session = await Session.create({
      userId: user._id,
      userAgent: data.userAgent,
      location: data.location,
    });

    const sessionInfo = {
      sessionId: session._id,
    };

    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

    const accessToken = signToken({
      userId: user._id,
      ...sessionInfo,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({
  otp,
  verifyToken,
  userAgent,
  location,
}: LoginParams) => {
  // verify the user's email
  const { email } = await verifyOTP(
    otp,
    verifyToken,
    OTPPurpose.EMAIL_VERIFICATION
  );

  const user = await User.findOneAndUpdate(
    { email },
    {
      verified: true,
      verifiedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) throw new AppError("Email is incorrect.", StatusCodes.NOT_FOUND);

  const userId = user._id;

  // create a session
  const session = await Session.create({
    userId,
    userAgent,
    location,
  });
  // sign access token & refresh token
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    sessionId: session._id,
    userId: userId,
  });

  // return user & tokens
  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (token: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(token, {
    secret: jwt_refresh_secret,
  });

  if (!payload) throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);

  const session = await Session.findById(payload.sessionId);
  if (!session && session!.expiresAt.getTime() > Date.now())
    throw new AppError("Session expired", StatusCodes.UNAUTHORIZED);

  const sessionNeedsRefresh =
    session!.expiresAt.getTime() - Date.now() <= 24 * 60 * 60 * 1000;

  if (sessionNeedsRefresh) {
    session!.expiresAt = addDays(new Date(), 30);
    await session!.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        {
          sessionId: session!._id,
        },
        refreshTokenSignOptions
      )
    : undefined;

  const accessToken = signToken({
    userId: session!.userId,
    sessionId: session!._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyOTP = async (
  otp: string,
  token: string,
  purpose: OTPPurpose
) => {
  const { payload } = verifyToken<VerificationTokenPayload>(token, {
    secret: jwt_verify_secret,
  });

  if (!payload)
    throw new AppError(
      "Token is invalid or expired.",
      StatusCodes.UNAUTHORIZED
    );

  console.log(payload);
  const existingOtp = await OTP.findById({
    _id: payload.otpId,
    email: payload.email,
    purpose,
    expiresAt: { $gte: Date.now() },
    isUsed: false,
  });

  if (!existingOtp)
    throw new AppError(
      "The code has expired. Request a new one.",
      StatusCodes.UNAUTHORIZED
    );

  if (existingOtp.isUsed)
    throw new AppError(
      "This code is already used. Please request a new one.",
      StatusCodes.BAD_REQUEST
    );

  const isMatch = await existingOtp.compareOTPs(otp, existingOtp.otp);

  if (!isMatch)
    throw new AppError(
      "The entered code is incorrect. Please try again and check for typos.",
      StatusCodes.UNAUTHORIZED
    );

  existingOtp.isUsed = true;
  await existingOtp.save({
    validateBeforeSave: false,
  });

  return {
    name: payload.name,
    email: payload.email,
  };
};
