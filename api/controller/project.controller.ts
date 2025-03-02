import ApiFeatures from "../utils/api-features";
import Task from "../model/task.model";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-errors";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import Project from "../model/project.model";

const getProjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(
      Project.find({
        user: req.userId,
      }),
      req.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const projects = await features.query.populate("user");

    res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        projects,
      },
    });
  },
);

const getProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await Project.findOne({
      user: req.userId,
      _id: req.params.id,
    }).populate("user");

    if (!project) {
      return next(
        new AppError(`No project found with the id ${req.params.id}`, 404),
      );
    }

    res.status(302).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

const createProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existedProject = await Project.exists({
      user: req.userId,
      name: req.body.name,
    });

    if (existedProject)
      return next(
        new AppError(
          `Project with the name '${req.body.name}' already exists.`,
          StatusCodes.CONFLICT,
        ),
      );

    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo,
      user: req.userId,
    });

    res.status(201).json({
      status: "success",
      message: "Project successfully created.",
      data: {
        project,
      },
    });
  },
);

const deleteProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await Task.deleteMany({
      user: req.userId,
      project: req.params.id,
    });

    if (!tasks) {
      return next(
        new AppError(
          `No tasks found with the project id ${req.params.id}`,
          404,
        ),
      );
    }

    const project = await Project.findOneAndDelete({
      user: req.userId,
      _id: req.params.id,
    });

    if (!project) {
      return next(
        new AppError(`No project found with the id ${req.params.id}`, 404),
      );
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: "success",
      message: "Project successfully deleted.",
      data: null,
    });
  },
);

const updateProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingProject = await Project.exists({
      user: req.userId,
      _id: req.params.id,
    });
    if (!existingProject) {
      return next(
        new AppError(
          `No project found with the id ${req.params.id}`,
          StatusCodes.NOT_FOUND,
        ),
      );
    }

    const project = await Project.findOneAndUpdate(
      {
        user: req.userId,
        _id: req.params.id,
      },
      {
        name: req.body.name,
        description: req.body.description,
        logo: req.body.logo,
        favorite: req.body.favorite,
      },
    );

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Project successfully updated.",
      data: { project },
    });
  },
);

const addProjectToFavorites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingProject = await Project.exists({
      user: req.userId,
      _id: req.params.id,
    });
    if (!existingProject) {
      return next(
        new AppError(`No project found with the id ${req.params.id}`, 404),
      );
    }

    const project = await Project.findOneAndUpdate(
      {
        user: req.userId,
        _id: req.params.id,
      },
      {
        favorite: true,
      },
    );

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Project successfully added to favorites.",
      data: { project },
    });
  },
);

const removeProjectFromFavorites = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingProject = await Project.exists({
      user: req.userId,
      _id: req.params.id,
    });
    if (!existingProject) {
      return next(
        new AppError(`No project found with the id ${req.params.id}`, 404),
      );
    }

    await Project.findOneAndUpdate(
      {
        user: req.userId,
        _id: req.params.id,
      },
      {
        favorite: false,
      },
    );

    res.status(204).json({
      status: "success",
      message: "Project successfully removed from favorites",
    });
  },
);

export {
  getProjects,
  getProject,
  updateProject,
  createProject,
  deleteProject,
  addProjectToFavorites,
  removeProjectFromFavorites,
};
