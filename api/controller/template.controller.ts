import { NextFunction, Request, Response } from "express";
import Template from "../model/template.model";
import ApiFeatures from "../utils/api-features";
import catchAsync from "../utils/catch-errors";
import AppError from "../utils/app-error";
import TemplateCategory from "../model/template-category.model";
import { StatusCodes } from "http-status-codes";

const getTemplates = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let query = Template.find();

    if (req.query.category && req.query.category === "enable")
      query = query.populate("category");

    if (req.query.user && req.query.user === "enable")
      query = query.populate("user");

    const features = new ApiFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const templates = await features.query;

    res.status(StatusCodes.OK).json({
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
    const category = await TemplateCategory.findOne({
      name: {
        $regex: req.body.category,
        $options: "i",
      },
    });
    if (!category)
      return next(
        new AppError(
          "No category found with this name. Please recheck for typos.",
          StatusCodes.NOT_FOUND,
        ),
      );

    const template = await Template.create({
      name: req.body.name,
      description: req.body.description,
      content: req.body.content,
      exampleUrl: req.body.exampleUrl,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      category: category._id,
      user: req.userId,
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: {
        template,
      },
    });
  },
);

const getTemplateCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let query = TemplateCategory.find();

    if (req.query.templates && req.query.templates === "enable")
      query = query.populate("templates");

    const categories = await query;

    res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        categories,
      },
    });
  },
);

export { getTemplates, getTemplate, createTemplate, getTemplateCategories };
