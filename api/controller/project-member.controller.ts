import catchErrors from "../utils/catch-errors";
import { z } from "zod";
import MemberModel from "../model/member.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import AppError from "../utils/app-error";
import { generateNotificationName } from "../constants/notification.constant";
import NotificationModel, {
  NotificationTypeEnum,
} from "../model/notification.model";
import { UserDocument } from "../model/user.model";
import NotificationTypeModel from "../model/notification-type.model";

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
    const validData = z.record(z.any()).parse(req.body);

    const [memberships, notificationType] = await Promise.all([
      MemberModel.findOneAndUpdate(
        {
          user: req.userId,
          "memberships.entity._id": validData._id,
          "memberships.status": "pending",
          "memberships.invited": false,
        },
        { $set: { "memberships.$.status": "approved" } },
        { new: true }
      ).populate("user", "name email avatar"),
      NotificationTypeModel.findOne({
        name: NotificationTypeEnum.MEMBER_INVITATION_APPROVED,
      }),
    ]);

    if (!memberships)
      return next(
        new AppError("There is no request yet", StatusCodes.NOT_FOUND)
      );

    await NotificationModel.create({
      name: generateNotificationName(
        NotificationTypeEnum.MEMBER_INVITATION_APPROVED,
        [
          (memberships.user as unknown as UserDocument).name,
          (memberships.memberships[0].entity as any).name,
        ]
      ),
      description: "You approved an invitation!",
      data: memberships.memberships[0].entity,
      value: validData.entity._id,
      user: memberships.user._id,
      type: notificationType?._id,
    });

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      data: { memberships },
    });
  }
);

export const rejectProjectMemberRequest = catchErrors(
  async (req, res, next) => {
    const validData = z.record(z.any()).parse(req.body);

    const [memberships, notificationType] = await Promise.all([
      MemberModel.findOneAndUpdate(
        {
          user: req.userId,
          "memberships.entity._id": validData._id,
          "memberships.status": "pending",
          "memberships.invited": false,
        },
        { $set: { "memberships.$.status": "rejected" } },
        { new: true }
      ).populate("user", "name email avatar"),
      NotificationTypeModel.findOne({
        name: NotificationTypeEnum.MEMBER_INVITATION_REJECTED,
      }),
    ]);

    if (!memberships)
      return next(
        new AppError("There is no request yet", StatusCodes.NOT_FOUND)
      );

    await NotificationModel.create({
      name: generateNotificationName(
        NotificationTypeEnum.MEMBER_INVITATION_REJECTED,
        [
          (memberships.user as unknown as UserDocument).name,
          (memberships.memberships[0].entity as any).name,
        ]
      ),
      description: "You rejected an invitation!",
      data: memberships.memberships[0].entity,
      value: validData.entity._id,
      user: memberships.user._id,
      type: notificationType?._id,
    });

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      data: { memberships },
    });
  }
);
