import catchErrors from "../utils/catch-errors";
import MembershipTypeModel from "../model/membership-type.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import { z } from "zod";
import AppError from "../utils/app-error";

export const getMembershipTypes = catchErrors(async (req, res, next) => {
  const memberships = await MembershipTypeModel.find();

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Membership types fetched successfully",
    data: {
      memberships,
    },
  });
});

export const getMembershipType = catchErrors(async (req, res, next) => {
  const validId = z.string().parse(req.params.id);

  const membership = await MembershipTypeModel.findById(validId);

  if (!membership)
    return next(
      new AppError(
        "There is no membership type with this id",
        StatusCodes.NOT_FOUND,
      ),
    );

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Membership type fetched successfully",
    data: {
      membership,
    },
  });
});

export const createMembershipType = catchErrors(async (req, res, next) => {
  const validData = z
    .object({
      name: z.string().trim(),
      label: z.string().trim(),
      description: z.string().trim().optional(),
    })
    .parse(req.body);

  const membership = await MembershipTypeModel.create({
    name: validData.name,
    description: validData.description,
    label: validData.label,
  });

  res.status(StatusCodes.CREATED).json({
    status: ResponseStatues.SUCCESS,
    message: "Membership type created successfully",
    data: {
      membership,
    },
  });
});

export const deleteMembershipType = catchErrors(async (req, res, next) => {
  const validId = z.string().parse(req.params.id);

  await MembershipTypeModel.findByIdAndDelete(validId);

  res.status(StatusCodes.NO_CONTENT).json({
    status: ResponseStatues.SUCCESS,
    message: "Membership type deleted successfully",
  });
});

export const updateMembershipType = catchErrors(async (req, res, next) => {
  const validId = z.string().parse(req.params.id);

  const membership = await MembershipTypeModel.findByIdAndUpdate(
    validId,
    {
      name: req.body.name,
      description: req.body.description,
      label: req.body.label,
    },
    { new: true },
  );

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Membership type updated successfully",
    data: {
      membership,
    },
  });
});
