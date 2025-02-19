import { NextFunction, Request, Response } from "express";

import catchErrors from "../utils/catch-errors";
import User from "../model/user.model";
import AppError from "../utils/app-error";

export const getAllUsers = catchErrors(async (req: Request, res: Response) => {
  const users = await User.find()
    .populate("plan")
    .populate("tasks")
    .populate("projects");

  res.status(200).json({
    status: "success",
    length: users.length,
    data: {
      users,
    },
  });
});

export const getUser = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id)
      .populate("plan")
      .populate("tasks")
      .populate("projects");
    if (!user) return next(new AppError("No user found by this id", 404));

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);
