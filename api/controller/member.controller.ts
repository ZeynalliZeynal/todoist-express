import catchErrors from "../utils/catch-errors";
import MemberModel, { MEMBER_ENTITY_TYPES } from "../model/member.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import { z } from "zod";
import UserModel, { UserDocument } from "../model/user.model";
import AppError from "../utils/app-error";
import ProjectModel from "../model/project.model";

export const getMembershipsProfile = catchErrors(async (req, res, next) => {
  const profile = await MemberModel.findOne({
    user: req.userId,
  }).populate("user", "name email avatar location online");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    data: {
      profile,
    },
  });
});

export const getMembers = catchErrors(async (req, res) => {
  const members = await MemberModel.find({
    $and: [
      {
        $or: [
          { "memberships.status": "pending" },
          { "memberships.entity": { $exists: false } },
        ],
      },
      { user: { $ne: req.userId } },
      { activated: true },
    ],
  })
    .populate("user", "name email avatar location online lastOnline")
    .populate("memberships.entity")
    .select("-memberships.permissions -activated");

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
      new AppError("No member found with this email", StatusCodes.NOT_FOUND)
    );

  const member = await MemberModel.findOne({
    user: user._id,
  })
    .populate("user", "name email avatar location")
    .select("-memberships.permissions -activated");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    data: {
      member,
    },
  });
});

export const createMembershipProfile = catchErrors(async (req, res, next) => {
  const existing = await MemberModel.exists({
    user: req.userId,
  });

  if (existing)
    return next(
      new AppError(
        "You have already a membership profile",
        StatusCodes.CONFLICT
      )
    );

  const profile = await MemberModel.create({ user: req.userId });

  res.status(StatusCodes.CREATED).json({
    status: ResponseStatues.SUCCESS,
    message: "Your membership profile has been created.",
    data: {
      profile,
    },
  });
});

export const inviteMember = catchErrors(async (req, res, next) => {
  const validMemberId = z.string().parse(req.params.id);
  const validData = z
    .object({
      entity: z.record(z.any()),
      entityType: z.enum(MEMBER_ENTITY_TYPES),
    })
    .strict()
    .parse(req.body);

  const existingMember = await MemberModel.exists({
    _id: validMemberId,
    user: { $ne: req.userId },
    memberships: {
      $elemMatch: {
        entity: validData.entity,
        entityType: validData.entityType,
      },
    },
  });

  if (existingMember)
    return next(
      new AppError(
        "This member has already been invited here",
        StatusCodes.CONFLICT
      )
    );

  const memberToInvite = await MemberModel.findOne({
    _id: validMemberId,
    user: { $ne: req.userId },
    memberships: {
      $not: {
        $elemMatch: {
          entity: validData.entity,
          entityType: validData.entityType,
        },
      },
    },
  });

  if (!memberToInvite)
    return next(
      new AppError("No member found with this id", StatusCodes.NOT_FOUND)
    );

  const result = await MemberModel.findByIdAndUpdate(memberToInvite._id, {
    $push: {
      memberships: {
        invited: true,
        entity: validData.entity,
        entityType: validData.entityType,
      },
    },
  }).populate("user", "name email avatar online lastOnline");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `Invitation request has been sent to ${
      (result?.user as unknown as UserDocument).email
    }`,
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

  const membersToUpdate = await MemberModel.find({
    _id: { $in: validData.members },
    user: { $ne: req.userId },
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
        StatusCodes.CONFLICT
      )
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
    }
  );

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `Invitation request has been sent to ${result.modifiedCount} user(s)`,
  });
});

export const requestToJoinAsMember = catchErrors(async (req, res, next) => {
  const validData = z
    .object({
      entity: z.string(),
      entityType: z.enum(MEMBER_ENTITY_TYPES),
    })
    .strict()
    .parse(req.body);

  if (validData.entityType === "project") {
    const projects = await ProjectModel.find({
      user: req.userId,
    });

    const projectIds = projects.map((project) => project._id?.toString());
    if (projectIds.includes(validData.entity))
      return next(
        new AppError(
          "You cannot join to a project you own.",
          StatusCodes.CONFLICT
        )
      );
  }

  const existingMembership = await MemberModel.findOne({
    user: req.userId,
    memberships: {
      $elemMatch: {
        entity: validData.entity,
        entityType: validData.entityType,
      },
    },
  });

  if (existingMembership) {
    return next(
      new AppError(
        "You have already requested to join this entity.",
        StatusCodes.CONFLICT
      )
    );
  }
  const result = await MemberModel.findOneAndUpdate(
    { user: req.userId },
    {
      $push: {
        memberships: {
          entity: validData.entity,
          entityType: validData.entityType,
          status: "pending",
          invited: false,
        },
      },
    },
    { new: true, upsert: true }
  );

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `Invitation request has been sent.`,
    data: {
      memberships: result,
    },
  });
});

export const approveMembershipInvitation = catchErrors(
  async (req, res, next) => {
    const validEntityId = z.string().parse(req.params.id);

    const memberships = await MemberModel.findOneAndUpdate(
      {
        user: req.userId,
        "memberships.entity": validEntityId,
        "memberships.status": "pending",
        "memberships.invited": true,
      },
      { $set: { "memberships.$.status": "approved" } },
      { new: true }
    );

    if (!memberships)
      return next(
        new AppError(
          "No membership found with this entity",
          StatusCodes.NOT_FOUND
        )
      );

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: `You are now a member to an entity`,
      data: {
        memberships,
      },
    });
  }
);

export const rejectMembershipInvitation = catchErrors(
  async (req, res, next) => {
    const validEntityId = z.string().parse(req.params.id);

    const memberships = await MemberModel.findOneAndUpdate(
      {
        user: req.userId,
        "memberships.entity": validEntityId,
        "memberships.status": "pending",
        "memberships.invited": true,
      },
      { $set: { "memberships.$.status": "rejected" } },
      { new: true }
    );

    if (!memberships)
      return next(
        new AppError(
          "No membership found with this entity",
          StatusCodes.NOT_FOUND
        )
      );

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: `You rejected to be member of this entity`,
      data: {
        memberships,
      },
    });
  }
);
