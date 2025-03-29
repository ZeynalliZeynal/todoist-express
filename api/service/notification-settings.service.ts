import { z } from "zod";
import NotificationSettingsModel from "../model/notification-settings.model";
import NotificationTypeModel from "../model/notification-type.model";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

export const enableNotificationService = async ({
  userId,
  typeId,
}: {
  userId: mongoose.Types.ObjectId;
  typeId: string;
}) => {
  const validType = z.string().parse(typeId);

  const type = await NotificationTypeModel.findById(validType);

  if (!type)
    throw new AppError("Notification type not found", StatusCodes.NOT_FOUND);

  await NotificationSettingsModel.findOneAndUpdate(
    {
      user: userId,
      "preferences.type": validType,
    },
    { $set: { "preferences.$.enabled": true } }
  );

  return type;
};

export const disableNotificationService = async ({
  userId,
  typeId,
}: {
  userId: mongoose.Types.ObjectId;
  typeId: string;
}) => {
  const validType = z.string().parse(typeId);

  const type = await NotificationTypeModel.findById(validType);

  if (!type)
    throw new AppError("Notification type not found", StatusCodes.NOT_FOUND);

  await NotificationSettingsModel.findOneAndUpdate(
    {
      user: userId,
      "preferences.type": validType,
    },
    { $set: { "preferences.$.enabled": false } }
  );

  return type;
};
