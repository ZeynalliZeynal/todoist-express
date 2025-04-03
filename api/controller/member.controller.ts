import catchErrors from "../utils/catch-errors";
import MemberModel, { MEMBER_ENTITY_TYPES } from "../model/member.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import { z } from "zod";
import UserModel, { UserDocument } from "../model/user.model";
import AppError from "../utils/app-error";
import ProjectModel from "../model/project.model";

export const getMembers = catchErrors(async (req, res) => {
  const members = await MemberModel.find({
    activated: true,
  })
    .populate("user", "name email avatar")
    .select("-memberships");

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
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    data: {
      member,
    },
  });
});

export const inviteMember = catchErrors(async (req, res, next) => {
  const validId = z.string().parse(req.params.id);

  const validData = z
    .object({
      entity: z.string(),
      entityType: z.enum(MEMBER_ENTITY_TYPES),
    })
    .strict()
    .parse(req.body);

  let entity;
  if (validData.entityType === "project")
    entity = await ProjectModel.findById(validData.entity);

  if (!entity)
    return next(
      new AppError("An entity id must be provided", StatusCodes.BAD_REQUEST)
    );

  const member = await MemberModel.findByIdAndUpdate(
    validId,
    {
      memberships: {
        $push: {
          entity,
          entityType: validData.entityType,
        },
      },
    },
    { new: true }
  ).populate("user", "name email avatar");

  if (!member)
    return next(
      new AppError("No member found with this id", StatusCodes.NOT_FOUND)
    );

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `Invitation request has been sent to ${
      (member.user as unknown as UserDocument).email
    }`,
  });
});
