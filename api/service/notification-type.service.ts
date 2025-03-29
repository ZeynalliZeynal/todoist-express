import NotificationTypeModel from "../model/notification-type.model";
import { z } from "zod";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import NotificationSettingsModel from "../model/notification-settings.model";

export const getNotificationTypesService = async () => {
  try {
    return await NotificationTypeModel.find().sort("-name");
  } catch (error) {
    throw error;
  }
};

export const createNotificationTypeService = async (data: {
  name: string;
  description: string;
}) => {
  try {
    const validData = z
      .object({
        name: z.string().min(3, "Minimum 3 characters required").trim(),
        description: z.string().trim().optional(),
      })
      .parse(data);

    const existingData = await NotificationTypeModel.exists({
      name: validData.name,
    });

    if (existingData)
      throw new AppError(
        `Notification type with the name ${validData.name} already exists. Please use another name.`,
        StatusCodes.BAD_REQUEST
      );

    const type = await NotificationTypeModel.create({
      name: validData.name,
      description: validData.description,
    });

    // update settings for all users
    await NotificationSettingsModel.updateMany(
      {},
      {
        $push: {
          preferences: {
            type: type._id,
            enabled: true,
          },
        },
      }
    );

    return type;
  } catch (error) {
    throw error;
  }
};
