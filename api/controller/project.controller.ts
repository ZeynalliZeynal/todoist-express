import ApiFeatures from "../utils/api-features";
import Task from "../model/task.model";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-errors";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import Project from "../model/project.model";
import slugify from "slugify";
import { createNotificationService } from "../service/notification.service";
import { generateNotificationName } from "../constants/notification.constant";
import { NotificationTypeEnum } from "../model/notification.model";
import kleur from "kleur";

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

    let query = features.query;

    if (req.query.slug) query = query.find({ slug: req.query.slug });

    const projects = await query.populate("user").populate("tasks");

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
      slug: slugify(req.body.name, { lower: true }),
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
    await Task.deleteMany({
      user: req.userId,
      project: req.params.id,
    });

    const project = await Project.findOneAndDelete({
      user: req.userId,
      _id: req.params.id,
    });

    if (!project) {
      return next(
        new AppError(`No project found with the id ${req.params.id}`, 404),
      );
    }

    try {
      await createNotificationService({
        name: generateNotificationName(
          NotificationTypeEnum.PROJECT_DELETED,
          project.name,
        )!,
        data: project.toObject(),
        value: project.id,
        type: NotificationTypeEnum.PROJECT_DELETED,
        user: req.userId!,
      });
    } catch (error) {
      console.log(kleur.bgBlue(error as string));
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
    const project = await Project.findOne({
      user: req.userId,
      _id: req.params.id,
    });
    if (!project) {
      return next(
        new AppError(
          `No project found with the id ${req.params.id}`,
          StatusCodes.NOT_FOUND,
        ),
      );
    }

    project.name = req.body.name;
    project.description = req.body.description;
    project.logo = req.body.logo;

    const existedProject = await Project.exists({
      user: req.userId,
      slug: slugify(project.name, { lower: true }),
      _id: { $ne: project._id },
    });

    if (existedProject)
      return next(
        new AppError(
          `Project with the name '${req.body.name}' already exists.`,
          StatusCodes.CONFLICT,
        ),
      );

    await project.save();

    try {
      await createNotificationService({
        name: generateNotificationName(
          NotificationTypeEnum.PROJECT_UPDATED,
          project.name,
        )!,
        data: project.toObject(),
        value: project.id,
        type: NotificationTypeEnum.PROJECT_UPDATED,
        user: req.userId!,
      });
    } catch (error) {
      console.log(kleur.bgBlue(error as string));
    }

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
