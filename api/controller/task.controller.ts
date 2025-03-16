import ApiFeatures from "../utils/api-features";
import Task from "../model/task.model";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-errors";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import Project from "../model/project.model";

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

    const tasks = await features.query
      .populate("user")
      .populate("project")
      .populate("tags");

    res.status(StatusCodes.OK).json({
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
    })
      .populate("user")
      .populate("project");

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
    if (!req.body.project)
      return next(
        new AppError(
          "A task must be belong to a project.",
          StatusCodes.BAD_REQUEST,
        ),
      );

    const project = await Project.exists({
      user: req.userId,
      _id: req.body.project,
    });

    if (!project)
      return next(
        new AppError(`Project with id ${req.body.project} not found.`, 404),
      );

    const existingTask = await Task.exists({
      user: req.userId,
      name: req.body.name,
      project: req.body.project,
    });

    if (existingTask)
      return next(
        new AppError(
          `Task with the name '${req.body.name}' already exists. Try another project or change the name.`,
          StatusCodes.CONFLICT,
        ),
      );

    const task = await Task.create({
      name: req.body.name,
      description: req.body.description,
      tags: req.body.tags,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      project: req.body.project,
      user: req.userId,
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Task successfully added.",
      data: {
        task,
      },
    });
  },
);

const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
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

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Task successfully updated.",
      data: {
        task,
      },
    });
  },
);

const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findOneAndDelete({
      user: req.userId,
      _id: req.params.id,
    });

    if (!task) {
      return next(
        new AppError(`No task found with the id ${req.params.id}`, 404),
      );
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
      message: "Task successfully deleted.",
      data: null,
    });
  },
);

const clearTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await Task.deleteMany({
      user: req.userId,
      project: req.body.project,
    });

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
      message: "Tasks successfully cleared.",
      data: null,
    });
  },
);

export { createTask, updateTask, clearTasks, getTasks, getTask, deleteTask };
