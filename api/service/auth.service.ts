import User from "../model/user.model";
import {
  admin_email,
  client_dev_origin,
  jwt_refresh_secret,
  jwt_verify_secret,
} from "../constants/env";
import Session from "../model/session.model";
import appAssert from "../utils/app-assert";
import { StatusCodes } from "http-status-codes";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import AppError from "../utils/app-error";
import { sendMail } from "../utils/email";
import { otpVerificationEmail } from "../utils/email-templates";
import { addDays, addMinutes } from "date-fns";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import OTP, { OTPPurpose } from "../model/otp.model";
import crypto from "crypto";

export interface CreateAccountParams {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userAgent?: string;
  city?: string;
  country?: string;
  continent?: string;
}

export interface LoginParams {
  email: string;
  password: string;
  userAgent?: string;
}

export const createEmailVerificationOTP = async (
  email: string,
  otp: string,
  purpose: OTPPurpose,
) => {
  const user = await User.exists({ email, verified: false });
  if (!user)
    throw new AppError("The user is already verified", StatusCodes.NOT_FOUND);

  const existingOTP = await OTP.exists({ email });

  if (existingOTP)
    throw new AppError(
      "You cannot create a new request while one already existed.",
      StatusCodes.BAD_REQUEST,
    );

  const newOtp = await OTP.create({
    email,
    otp,
    purpose,
    expiresAt: addMinutes(Date.now(), 5),
  });

  return newOtp;
};

export const sendOTPEmailVerification = async (email: string) => {
  const existingUser = await User.findOne({ email });

  if (!existingUser)
    throw new AppError("Email is incorrect", StatusCodes.NOT_FOUND);

  const otp = crypto.randomInt(100000, 999999).toString();

  const url = `${client_dev_origin}/auth/login/email`;

  await createEmailVerificationOTP(email, otp, OTPPurpose.EMAIL_VERIFICATION);

  try {
    await sendMail({
      to: [email],
      ...otpVerificationEmail({
        otp,
        url,
        auth: "sign up",
        username: existingUser.name,
      }),
    });
  } catch (err) {
    throw new AppError(
      "Error occurred sending an email",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const createAccount = async (data: CreateAccountParams) => {
  //   verify that user doesn't exist
  const existingUser = await User.exists({
    email: data.email,
  });

  appAssert(!existingUser, "Email already in use", StatusCodes.CONFLICT);

  // create new user
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
    city: data.city,
    country: data.country,
    continent: data.continent,
    role: admin_email === data.email ? "admin" : "user",
  });

  /*
                          // create verification code
                          const verificationToken = jwt.sign({ userId: user._id }, jwt_verify_secret, {
                            expiresIn: jwt_verify_expires_in,
                          });
                        
                          // send verification email
                          const url = `${client_dev_origin}/auth/email/verify/${verificationToken}`;
                           */

  await sendOTPEmailVerification(user.email);

  // create session
  const session = await Session.create({
    userId: user._id,
    userAgent: data.userAgent,
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
    user: { name: user.name, email: user.email },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // get user by email
  const user = await User.findOne({ email }).select("+password");
  appAssert(user, "Email or password is incorrect", StatusCodes.UNAUTHORIZED);

  // validate password
  const isPasswordValid = await user!.comparePasswords(
    password,
    user!.password,
  );
  appAssert(
    isPasswordValid,
    "Invalid email or password",
    StatusCodes.UNAUTHORIZED,
  );

  const userId = user!.id;

  // create a session
  const session = await Session.create({
    userId,
    userAgent,
  });
  // sign access token & refresh token
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions,
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
        refreshTokenSignOptions,
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
  email: string,
  purpose: OTPPurpose,
) => {
  const findUser = await User.findOne({ email });

  if (!findUser)
    throw new AppError("Email is incorrect.", StatusCodes.NOT_FOUND);

  const findOTP = await OTP.findOne({
    email,
    purpose,
    expiresAt: { $gte: Date.now() },
    isUsed: false,
  });

  if (!findOTP)
    throw new AppError("OTP has expired.", StatusCodes.UNAUTHORIZED);

  const isMatch = await findOTP.compareOTPs(otp, findOTP.otp);

  if (!isMatch)
    throw new AppError(
      "OTP is incorrect. Please try again.",
      StatusCodes.UNAUTHORIZED,
    );

  findUser.verifiedAt = new Date();
  findUser.verified = true;

  findOTP.isUsed = true;

  await findUser.save({
    validateBeforeSave: false,
  });
  await findOTP.save();
};
export const verifyEmail = async (token: string) => {
  const decoded = jwt.verify(token, jwt_verify_secret);

  if (!decoded)
    throw new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED);

  const userId = (
    decoded as JwtPayload & {
      userId: mongoose.Types.ObjectId;
    }
  ).userId;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      verified: true,
      verifiedAt: Date.now(),
    },
    { new: true },
  );

  if (!updatedUser)
    throw new AppError("User not found", StatusCodes.UNAUTHORIZED);

  return {
    user: updatedUser,
  };
};
