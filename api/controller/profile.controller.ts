import { RequestHandler } from "express";
import catchErrors from "../utils/catch-errors";
import User from "../model/user.model";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

export const getUser: RequestHandler = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.userId).select("-__v").populate("tasks");

  if (!user)
    return next(
      new AppError(
        "No user found. You may not be logged in.",
        StatusCodes.NOT_FOUND,
      ),
    );

  return res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      user,
    },
  });
});
