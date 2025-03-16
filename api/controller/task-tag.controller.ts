import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-errors";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import TaskTag from "../model/task-tag.model";
import Task from "../model/task.model";

const getTaskTags = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tags = await TaskTag.find({
      user: req.userId,
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        tags,
      },
    });
  },
);

const createTaskTag = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingTag = await TaskTag.exists({
      user: req.userId,
      name: req.body.name,
    });

    if (existingTag)
      return next(
        new AppError(
          `Tag with the name '${req.body.name}' already exists.`,
          StatusCodes.CONFLICT,
        ),
      );

    const tag = await TaskTag.create({
      name: req.body.name,
      description: req.body.description,
      user: req.userId,
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Tag successfully created.",
      data: {
        tag,
      },
    });
  },
);

const updateTaskTag = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const tag = await TaskTag.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      {
        name: body.name,
        description: req.body.description,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!tag) {
      return next(
        new AppError(`No tag found with the id ${req.params.id}`, 404),
      );
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Tag successfully updated.",
      data: {
        tag,
      },
    });
  },
);

const deleteTaskTag = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tag = await TaskTag.findOneAndDelete({
      user: req.userId,
      _id: req.params.id,
    });

    if (!tag) {
      return next(
        new AppError(`No tag found with the id ${req.params.id}`, 404),
      );
    }

    await Task.updateMany(
      { tags: req.params.id, user: req.userId },
      { $pull: { tags: req.params.id } },
    );

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
      message: "Tag successfully deleted.",
      data: null,
    });
  },
);

export { createTaskTag, updateTaskTag, getTaskTags, deleteTaskTag };
