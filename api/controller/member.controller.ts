import catchErrors from "../utils/catch-errors";
import MemberModel, { MEMBER_ENTITY_TYPES } from "../model/member.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import { z } from "zod";
import UserModel from "../model/user.model";
import AppError from "../utils/app-error";
import ProjectModel from "../model/project.model";

export const getMemberships = catchErrors(async (req, res, next) => {
  const memberships = await MemberModel.find({
    user: req.userId,
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    data: {
      memberships,
    },
  });
});

export const getMembers = catchErrors(async (req, res) => {
  const members = await MemberModel.find({
    activated: true,
  })
    .populate("user", "name email avatar")
    .select("-memberships.permissions");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Members fetched successfully",
    data: {
      members,
    },
  });
});

export const getMember = catchErrors(async (req, res, next) => {
  const validEmail = z
    .string()
    .email("Not a valid email")
    .parse(req.params.email);

  const user = await UserModel.findOne({
    email: validEmail,
  });

  if (!user)
    return next(
      new AppError("No member found with this email", StatusCodes.NOT_FOUND),
    );

  const member = await MemberModel.findOne({
    user: user._id,
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    data: {
      member,
    },
  });
});

export const inviteMembers = catchErrors(async (req, res, next) => {
  const validData = z
    .object({
      entity: z.string(),
      entityType: z.enum(MEMBER_ENTITY_TYPES),
      members: z.array(z.string()).min(1, "At least one member required"),
    })
    .strict()
    .parse(req.body);

  let entity;
  if (validData.entityType === "project")
    entity = await ProjectModel.findById(validData.entity);

  if (!entity) {
    return next(
      new AppError("An entity id must be provided", StatusCodes.BAD_REQUEST),
    );
  }

  const membersToUpdate = await MemberModel.find({
    _id: { $in: validData.members },
    memberships: {
      $not: {
        $elemMatch: {
          entity: validData.entity,
          entityType: validData.entityType,
        },
      },
    },
  });

  if (membersToUpdate.length === 0) {
    return next(
      new AppError(
        "All selected users are already invited, rejected, or approved this invitation.",
        StatusCodes.CONFLICT,
      ),
    );
  }

  const memberIds = membersToUpdate.map((member) => member._id);

  const result = await MemberModel.updateMany(
    { _id: { $in: memberIds } },
    {
      $push: {
        memberships: {
          invited: true,
          entity: validData.entity,
          entityType: validData.entityType,
        },
      },
    },
  );

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `Invitation request has been sent to ${result.modifiedCount} user(s)`,
  });
});

export const approveMembershipInvitation = catchErrors(
  async (req, res, next) => {
    const validEntityId = z.string().parse(req.params.id);

    const memberships = await MemberModel.findOneAndUpdate(
      { user: req.userId, "memberships.entity": validEntityId },
      { $set: { "memberships.$.status": "approved" } },
      { new: true },
    );

    if (!memberships)
      return next(
        new AppError(
          "No membership found with this entity",
          StatusCodes.NOT_FOUND,
        ),
      );

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: `You are now a member to an entity`,
      data: {
        memberships,
      },
    });
  },
);

export const rejectMembershipInvitation = catchErrors(
  async (req, res, next) => {
    const validEntityId = z.string().parse(req.params.id);

    const memberships = await MemberModel.findOneAndUpdate(
      { user: req.userId, "memberships.entity": validEntityId },
      { $set: { "memberships.$.status": "rejected" } },
      { new: true },
    );

    if (!memberships)
      return next(
        new AppError(
          "No membership found with this entity",
          StatusCodes.NOT_FOUND,
        ),
      );

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: `You rejected to be member of this entity`,
      data: {
        memberships,
      },
    });
  },
);
