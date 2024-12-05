import { NextFunction, Request, Response } from "express";

import catchAsync from "../utils/catch-errors";
import User from "../model/user.model";
import AppError from "../utils/app-error";

const filterObj = (obj: Record<string, any>, keys: string[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (keys.includes(key)) newObj[key] = obj[key];
  });

  return newObj;
};

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users,
      },
    });
  },
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).populate("tasks");
    if (!user) return next(new AppError("No user found by this id", 404));

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
);
