import { NextFunction, Request, Response } from "express";
import Template from "../model/template.model";
import ApiFeatures from "../utils/api-features";
import catchAsync from "../utils/catch-errors";
import AppError from "../utils/app-error";

const getTemplates = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(Template.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const templates = await features.query;

    res.status(302).json({
      status: "success",
      data: {
        templates,
      },
    });
  },
);

const getTemplate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return next(
        new AppError(`No task found with the id ${req.params.id}`, 404),
      );
    }

    res.status(302).json({
      status: "success",
      data: {
        template,
      },
    });
  },
);

const createTemplate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const template = await Template.create({
      name: req.body.name,
      description: req.body.description,
      content: req.body.content,
      exampleUrl: req.body.exampleUrl,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
    });
    res.status(201).json({
      status: "success",
      data: {
        template,
      },
    });
  },
);

export { getTemplates, getTemplate, createTemplate };
