import { NextFunction, Request, Response } from "express";
import User, { RoleProps } from "../model/user.model";
import catchAsync from "../utils/catch-errors";
import catchErrors from "../utils/catch-errors";
import AppError from "../utils/app-error";
import {
  emailSchema,
  loginSchema,
  signupSchema,
  signupVerificationSchema,
} from "../validator/auth.schema";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  sendLoginEmailVerification,
  sendSignupEmailVerification,
} from "../service/auth.service";
import { StatusCodes } from "http-status-codes";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
  setVerifyCookies,
} from "../utils/cookies";
import { verifyToken } from "../utils/jwt";
import Session from "../model/session.model";
import appAssert from "../utils/app-assert";
import { apiip_accessKey } from "../constants/env";
import axios from "axios";
import requestIp from "request-ip";
import useragent from "useragent";

export const signup = catchErrors(async (req, res, next) => {
  const ip = requestIp.getClientIp(req);
  const userAgent = useragent.parse(req.headers["user-agent"]);
  const { otp, plan } = req.body;

  const userAgentObj = {
    browser: userAgent.toAgent() || "unknown",
    os: userAgent.os.toString() || "unknown",
    device: userAgent.device.toString() || "unknown",
  };

  let location;
  try {
    const res = await axios.get(
      `https://apiip.net/api/check?ip=${ip}&accessKey=${apiip_accessKey}`,
    );
    location = {
      city: res.data.city,
      country: res.data.countryName,
      continent: res.data.continentName,
    };
  } catch (err) {
    console.log("IP is invalid");
  }

  if (!req.query.token)
    return next(
      new AppError("Token is param required.", StatusCodes.BAD_REQUEST),
    );

  const request = signupSchema.parse({
    otp,
  });

  const { refreshToken, accessToken } = await createAccount({
    ...request,
    verifyToken: String(req.query.token),
    location,
    userAgent: userAgentObj,
    plan,
  });

  return setAuthCookies({ res, refreshToken, accessToken })
    .status(StatusCodes.OK)
    .json({
      status: "success",
      message: "Signup is successful.",
    });
});

export const login = catchErrors(async (req, res, next) => {
  const userAgent = useragent.parse(req.headers["user-agent"]);
  const userAgentObj = {
    browser: userAgent.toAgent() || "unknown",
    os: userAgent.os.toString() || "unknown",
    device: userAgent.device.toString() || "unknown",
  };

  const { otp } = req.body;

  if (!req.query.token)
    return next(
      new AppError("Token is param required.", StatusCodes.BAD_REQUEST),
    );

  const request = loginSchema.parse({
    otp,
  });

  const { accessToken, refreshToken } = await loginUser({
    ...request,
    verifyToken: String(req.query.token),
    userAgent: userAgentObj,
  });

  return setAuthCookies({ res, refreshToken, accessToken })
    .status(StatusCodes.OK)
    .json({
      status: "success",
      message: "Login is successful.",
    });
});

export const logout = catchErrors(async (req, res, next) => {
  const accessToken =
    req.headers.authorization?.split("Bearer ")[1].trim() ||
    req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);

  if (!payload || !payload.sessionId)
    return next(
      new AppError("You are not logged in.", StatusCodes.BAD_REQUEST),
    );

  await Session.findByIdAndDelete(payload.sessionId);

  await User.findByIdAndUpdate(
    payload.userId,
    { verified: false },
    { runValidators: false },
  );

  return clearAuthCookies(res).status(StatusCodes.OK).json({
    status: "success",
    message: "Logout successful",
  });
});

export const sendLoginVerifyEmailController = catchErrors(
  async (req, res, next) => {
    const email = emailSchema.parse(req.body.email);

    const token = await sendLoginEmailVerification({
      email,
    });

    return setVerifyCookies({
      res,
      verifyToken: token,
    })
      .status(StatusCodes.OK)
      .json({
        status: "success",
        message:
          "Verification email has been sent. The code will expire after 5 minutes.",
      });
  },
);

export const sendSignupVerifyEmailController = catchErrors(
  async (req, res, next) => {
    const request = signupVerificationSchema.parse(req.body);
    const ip =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      requestIp.getClientIp(req);

    let location;
    try {
      const res = await axios.get(
        `https://apiip.net/api/check?ip=${ip}&accessKey=${apiip_accessKey}`,
      );
      location = {
        city: res.data.city,
        country: res.data.countryName,
        continent: res.data.continentName,
      };
    } catch (err) {
      console.log("IP is invalid");
      location = { city: "Unknown", country: "Unknown", continent: "Unknown" };
    }

    const token = await sendSignupEmailVerification(request, location);

    return setVerifyCookies({
      res,
      verifyToken: token,
    })
      .status(StatusCodes.OK)
      .json({
        status: "success",
        message:
          "Verification email has been sent. The code will expire after 5 minutes.",
      });
  },
);

export const refreshToken = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    appAssert(refreshToken, "Missing refresh token", StatusCodes.UNAUTHORIZED);

    const { newRefreshToken, accessToken } =
      await refreshUserAccessToken(refreshToken);

    if (newRefreshToken) {
      res.cookie(
        "refreshToken",
        newRefreshToken,
        getRefreshTokenCookieOptions(),
      );
    }

    return res
      .status(StatusCodes.OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({
        status: "success",
        message: "Access token refreshed",
      });
  },
);

export const authorizeTo = (roles: RoleProps) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId).select("+role");
    if (!user || !roles.includes(user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          StatusCodes.FORBIDDEN,
        ),
      );
    }

    next();
  });

/*
export const verifyEmailController = catchErrors(async (req, res, next) => {
  // await verifyEmail(req.params.token);

  await verifyOTP(req.body.otp, req.body.email, OTPPurpose.EMAIL_VERIFICATION);

  return res.status(StatusCodes.OK).json({
    status: "success",
    message: "Email was successfully verified",
  });
});

export const updatePassword = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId).select("+password");

    if (!user)
      return next(
        new AppError("You are not logged in.", StatusCodes.UNAUTHORIZED),
      );

    if (!(await user.comparePasswords(req.body.passwordCurrent, user.password)))
      return next(
        new AppError("Password is incorrect.", StatusCodes.UNAUTHORIZED),
      );

    const session = await Session.findById(req.sessionId);

    if (!session)
      return next(new AppError("No session found.", StatusCodes.NOT_FOUND));

    await Session.deleteMany({
      userId: req.userId,
      _id: { $ne: req.sessionId },
    });

    const accessToken = signToken({
      sessionId: session._id,
      userId: user._id,
    });

    const refreshToken = signToken(
      { sessionId: session._id },
      refreshTokenSignOptions,
    );

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    return setAuthCookies({ res, accessToken, refreshToken })
      .status(StatusCodes.OK)
      .json({
        status: "success",
        message: "Password changed successfully.",
      });
  },
);

export const forgotPassword = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return next(
        new AppError("No user with this email.", StatusCodes.NOT_FOUND),
      );

    const resetToken = user.createResetPasswordToken();

    await user.save({
      validateBeforeSave: false,
    });

    const url = `${client_dev_origin}/auth/password/reset/${resetToken}`;

    try {
      await sendMail({
        to: [user.email],
        ...verifyEmailTemplate(url),
      });
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Check your email.",
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          "Failed to send the token to your email.",
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  },
);

export const resetPassword = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gte: Date.now(),
      },
    });

    if (!user)
      return next(
        new AppError("Token is invalid or has expired. Try again.", 400),
      );

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    await Session.deleteMany({
      userId: user._id,
    });

    return clearAuthCookies(res).status(StatusCodes.OK).json({
      status: "success",
      message:
        "Password reset successfully. You need to log in with your new password.",
    });
  },
);
*/
