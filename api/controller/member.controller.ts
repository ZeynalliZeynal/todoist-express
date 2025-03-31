import catchErrors from "../utils/catch-errors";
import MemberModel from "../model/member.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import { z } from "zod";
import MembershipTypeModel from "../model/membership-type.model";
import AppError from "../utils/app-error";
import ProjectMemberModel from "../model/project-member.model";

export const getMemberProfile = catchErrors(async (req, res, next) => {
  const existingMember = await MemberModel.exists({
    user: req.userId,
  });

  if (!existingMember)
    await MemberModel.create({
      user: req.userId,
    });

  const member = await MemberModel.findOne({
    user: req.userId,
  })
    .populate("user")
    .populate("memberships.membership");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Membership data fetched successfully",
    data: {
      member,
    },
  });
});

export const getMembers = catchErrors(async (req, res, next) => {
  const members = await MemberModel.find().populate("user");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Members fetched successfully",
    data: {
      members,
    },
  });
});

export const registerAsMemberTo = catchErrors(async (req, res, next) => {
  const validMembershipTypeId = z.string().parse(req.params.id);

  const membershipType = await MembershipTypeModel.findById(
    validMembershipTypeId,
  );

  if (!membershipType)
    return next(
      new AppError(
        "There is no membership type with this id",
        StatusCodes.NOT_FOUND,
      ),
    );

  const memberData = await MemberModel.findOneAndUpdate(
    { user: req.userId },
    { memberships: { $push: { membership: validMembershipTypeId } } },
  );

  if (!memberData)
    return next(
      new AppError("Your member data does not exist.", StatusCodes.NOT_FOUND),
    );

  if (membershipType.name === "project")
    await ProjectMemberModel.create({
      member: memberData.id,
    });

  res.status(StatusCodes.ACCEPTED).json({
    status: ResponseStatues.SUCCESS,
    message: `You are now open to joining to ${membershipType.name}s`,
    data: { memberData },
  });
});

export const unregisterAsMemberFrom = catchErrors(async (req, res, next) => {
  const validMembershipTypeId = z.string().parse(req.params.id);

  const membershipType = await MembershipTypeModel.findById(
    validMembershipTypeId,
  );

  if (!membershipType)
    return next(
      new AppError(
        "There is no membership type with this id",
        StatusCodes.NOT_FOUND,
      ),
    );

  const memberData = await MemberModel.findOneAndUpdate(
    { user: req.userId },
    { memberships: { $pull: { membership: validMembershipTypeId } } },
  );

  if (!memberData)
    return next(
      new AppError("Your member data does not exist.", StatusCodes.NOT_FOUND),
    );

  if (membershipType.name === "project")
    await ProjectMemberModel.findOneAndDelete({
      member: memberData.id,
    });

  if (membershipType.name === "project") await ProjectMemberModel.deleteMany();
  res.status(StatusCodes.ACCEPTED).json({
    status: ResponseStatues.SUCCESS,
    message: `You are removed from all ${membershipType.name}s and you will no longer be able to join to ${membershipType.name}s unless you register again.`,
    data: { memberData },
  });
});

export const activateMembership = catchErrors(async (req, res, next) => {
  const validMembershipTypeId = z.string().parse(req.params.id);

  const membershipType = await MembershipTypeModel.findById(
    validMembershipTypeId,
  );

  if (!membershipType)
    return next(
      new AppError(
        "There is no membership type with this id",
        StatusCodes.NOT_FOUND,
      ),
    );

  const memberData = await MemberModel.findOneAndUpdate(
    { user: req.userId, "memberships.membership": validMembershipTypeId },
    { $set: { "memberships.$.active": true } },
  );

  res.status(StatusCodes.ACCEPTED).json({
    status: ResponseStatues.SUCCESS,
    message: `You activated your membership to ${membershipType.name}s`,
    data: { memberData },
  });
});

export const deactivateMembership = catchErrors(async (req, res, next) => {
  const validMembershipTypeId = z.string().parse(req.params.id);

  const membershipType = await MembershipTypeModel.findById(
    validMembershipTypeId,
  );

  if (!membershipType)
    return next(
      new AppError(
        "There is no membership type with this id",
        StatusCodes.NOT_FOUND,
      ),
    );

  const memberData = await MemberModel.findOneAndUpdate(
    { user: req.userId, "memberships.membership": validMembershipTypeId },
    { $set: { "memberships.$.active": false } },
  );

  res.status(StatusCodes.ACCEPTED).json({
    status: ResponseStatues.SUCCESS,
    message: `You deactivated your membership to ${membershipType.name}s. You will no longer be able to join to further ${membershipType.name}s unless you activate it.`,
    data: { memberData },
  });
});
