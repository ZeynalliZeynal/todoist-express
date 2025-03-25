import { RequestHandler } from "express";
import catchErrors from "../utils/catch-errors";
import User from "../model/user.model";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import Task from "../model/task.model";
import Project from "../model/project.model";
import Notification from "../model/notification.model";

export const getProfile: RequestHandler = catchErrors(
  async (req, res, next) => {
    const user = await User.findById(req.userId)
      .populate("plan")
      .populate("tasks")
      .populate("notifications")
      .populate("projects");

    const taskCount = await Task.countDocuments({
      user: req.userId,
    });

    const projectCount = await Project.countDocuments({
      user: req.userId,
    });

    const notificationCount = await Notification.countDocuments({
      user: req.userId,
    });

    if (!user)
      return next(
        new AppError(
          "No user found. You may not be logged in.",
          StatusCodes.NOT_FOUND
        )
      );

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        taskCount,
        projectCount,
        notificationCount,
        user,
      },
    });
  }
);

export const updateProfile: RequestHandler = catchErrors(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: req.body.name,
        avatar: req.body.avatar,
      },
      { new: true, runValidators: true }
    );

    if (!user)
      return next(
        new AppError(
          "No user found. You may not be logged in.",
          StatusCodes.NOT_FOUND
        )
      );

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Profile successfully updated.",
      data: {
        user,
      },
    });
  }
);
