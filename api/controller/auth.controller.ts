import { NextFunction, Request, Response } from "express";
import User, { Roles } from "../model/user.model";
import catchAsync from "../utils/catch-errors";
import catchErrors from "../utils/catch-errors";
import AppError from "../utils/app-error";
import crypto from "crypto";
import { loginSchema, signupSchema } from "../validator/auth.schema";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  verifyEmail,
} from "../service/auth.service";
import { StatusCodes } from "http-status-codes";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { refreshTokenSignOptions, signToken, verifyToken } from "../utils/jwt";
import Session from "../model/session.model";
import appAssert from "../utils/app-assert";
import { verifyEmailTemplate } from "../utils/email-templates";
import { sendMail } from "../utils/email";
import { client_dev_origin } from "../constants/env";

export const signup = catchErrors(async (req, res, next) => {
  const request = signupSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { refreshToken, accessToken, user } = await createAccount(request);

  return setAuthCookies({ res, refreshToken, accessToken })
    .status(StatusCodes.OK)
    .json({
      status: "success",
      message: "Verification email sent. Please verify your email to continue.",
    });
});

export const login = catchErrors(async (req, res, next) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { accessToken, refreshToken } = await loginUser(request);

  return setAuthCookies({ res, refreshToken, accessToken })
    .status(StatusCodes.OK)
    .json({
      status: "success",
      message: "Login successful",
    });
});

export const logout = catchErrors(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);

  if (payload) await Session.findByIdAndDelete(payload.sessionId);

  return clearAuthCookies(res).status(StatusCodes.OK).json({
    status: "success",
    message: "Logout successful",
  });
});

export const verifyEmailController = catchErrors(async (req, res, next) => {
  await verifyEmail(req.params.token);

  return res.status(StatusCodes.OK).json({
    message: "Email was successfully verified",
  });
});

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

export const authorizeTo = (roles: Roles) =>
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
