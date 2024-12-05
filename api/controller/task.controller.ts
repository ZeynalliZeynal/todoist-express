import ApiFeatures from "../utils/api-features";
import Task from "../model/task.model";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-errors";
import AppError from "../utils/app-error";

const getTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(
      Task.find({
        user: req.userId,
      }),
      req.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tasks = await features.query;

    res.status(302).json({
      status: "success",
      data: {
        tasks,
      },
    });
  },
);

const getTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findOne({
      user: req.userId,
      _id: req.params.id,
    }).populate("user");

    if (!task) {
      return next(
        new AppError(`No task found with the id ${req.params.id}`, 404),
      );
    }

    res.status(302).json({
      status: "success",
      data: {
        task,
      },
    });
  },
);

const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.create({
      name: req.body.name,
      description: req.body.description,
      completed: req.body.completed,
      tags: req.body.tags,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      user: req.userId,
    });

    res.status(201).json({
      status: "success",
      data: {
        task,
      },
    });
  },
);

const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      return next(
        new AppError(`No task found with the id ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  },
);

const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return next(
        new AppError(`No task found with the id ${req.params.id}`, 404),
      );
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);

const clearTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await Task.deleteMany();

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);

export { createTask, updateTask, clearTasks, getTasks, getTask, deleteTask };
