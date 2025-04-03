import catchErrors from "../utils/catch-errors";
import { z } from "zod";
import MemberModel from "../model/member.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import AppError from "../utils/app-error";

export const getProjectMembers = catchErrors(async (req, res, next) => {
  const validProjectId = z.string().parse(req.params.id);

  const members = await MemberModel.find({
    "memberships.entity": validProjectId,
  }).populate("user", "name email avatar");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    data: {
      members,
    },
  });
});

export const approveProjectMemberRequest = catchErrors(
  async (req, res, next) => {
    const validProjectId = z.string().parse(req.params.id);

    const memberships = await MemberModel.findOneAndUpdate(
      {
        "memberships.entity": validProjectId,
        "memberships.status": "pending",
        "memberships.invited": false,
      },
      { $set: { "memberships.$.status": "approved" } },
      { new: true },
    ).populate("user", "name email avatar");

    if (!memberships)
      return next(
        new AppError("There is no request yet", StatusCodes.NOT_FOUND),
      );

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      data: { memberships },
    });
  },
);

export const rejectProjectMemberRequest = catchErrors(
  async (req, res, next) => {
    const validProjectId = z.string().parse(req.params.id);

    const memberships = await MemberModel.findOneAndUpdate(
      {
        "memberships.entity": validProjectId,
        "memberships.status": "pending",
        "memberships.invited": false,
      },
      { $set: { "memberships.$.status": "rejected" } },
      { new: true },
    ).populate("user", "name email avatar");

    if (!memberships)
      return next(
        new AppError("There is no request yet", StatusCodes.NOT_FOUND),
      );

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      data: { memberships },
    });
  },
);
