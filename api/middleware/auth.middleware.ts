import { RequestHandler } from "express";
import catchErrors from "../utils/catch-errors";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../utils/jwt";
import User from "../model/user.model";
import Session from "../model/session.model";
import { getToken } from "../utils/cookies";

export const authenticate: RequestHandler = catchErrors(
  async (req, res, next) => {
    const accessToken = getToken(req, "accessToken");

    if (!accessToken)
      return next(
        new AppError(
          "You must log in to perform this action",
          StatusCodes.UNAUTHORIZED,
        ),
      );
    const { payload, error } = verifyToken(accessToken);
    if (error || !payload)
      return next(
        new AppError(
          "Invalid or expired token. Try to log in again.",
          StatusCodes.UNAUTHORIZED,
        ),
      );

    const currentSession = await Session.findById(payload.sessionId);

    const currentUser = await User.findById(payload.userId).select(
      "+role -__v",
    );

    if (!currentUser)
      return next(
        new AppError(
          "Token is no longer belong to this user. Please log in again",
          StatusCodes.UNAUTHORIZED,
        ),
      );

    if (!currentSession)
      return next(
        new AppError(
          "Your session has expired or deleted. Please log in again.",
          StatusCodes.UNAUTHORIZED,
        ),
      );

    if (!currentUser.verified)
      return next(
        new AppError("Please verify your email", StatusCodes.UNAUTHORIZED),
      );

    // if (currentUser.isPasswordChangedAfter(payload.iat))
    //   return next(
    //     new AppError(
    //       "Password recently changed. Please log in again",
    //       StatusCodes.UNAUTHORIZED,
    //     ),
    //   );

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();
  },
);
