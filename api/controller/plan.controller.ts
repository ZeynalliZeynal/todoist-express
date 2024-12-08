import { RequestHandler } from "express";
import catchErrors from "../utils/catch-errors";
import Plan from "../model/plan.model";
import { StatusCodes } from "http-status-codes";
import PlanFeature from "../model/plan-features.model";

export const getPlans: RequestHandler = catchErrors(async (req, res, next) => {
  const plans = await Plan.find().populate("features");

  return res.status(StatusCodes.OK).json({
    status: "success",
    data: { plans },
  });
});

export const createPlan: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { name, description, price, featuresIds } = req.body;

    const plan = await Plan.create({
      name,
      description,
      price,
      featuresIds,
    });

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        plan,
      },
    });
  },
);

export const getPlanFeatures: RequestHandler = catchErrors(
  async (req, res, next) => {
    const features = await PlanFeature.find().populate("allPlans");

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: { features },
    });
  },
);

export const createPlanFeature: RequestHandler = catchErrors(
  async (req, res, next) => {
    const { name, description, title, plans } = req.body;

    const feature = await PlanFeature.create({
      title,
      name,
      description,
      plans,
    });

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        feature,
      },
    });
  },
);
