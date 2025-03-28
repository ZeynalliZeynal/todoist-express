import Notification, {
  NotificationTypeEnum,
} from "../model/notification.model";
import { notificationValidator } from "../validator/notification.validator";
import { z } from "zod";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import NotificationTypeModel from "../model/notification-type.model";

// get services
export const getNotificationsService = async (
  user: mongoose.Types.ObjectId,
) => {
  try {
    const notifications = await Notification.find({
      user,
      dismissed: { $ne: true },
    })
      .populate("type")
      .sort("-createdAt");

    return notifications;
  } catch (error) {
    throw error;
  }
};

export const getNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId,
) => {
  try {
    const validId = z.string().min(1, "Id is required").parse(id);
    const notification = await Notification.findOne({
      user,
      _id: validId,
      dismissed: { $ne: true },
    });

    return notification;
  } catch (error) {
    throw error;
  }
};

// create service
interface CreateNotificationProps {
  name: string;
  description?: string;
  data: object;
  value: string;

  type: NotificationTypeEnum;
  user: mongoose.Types.ObjectId;
}

export const createNotificationService = async (
  data: CreateNotificationProps,
) => {
  const validData = notificationValidator.parse(data);

  const type = await NotificationTypeModel.findOne({
    name: validData.type,
  });

  if (!type)
    throw new AppError(
      `No notification type found with the name "${validData.type}"`,
      StatusCodes.NOT_FOUND,
    );

  const notification = await Notification.create({
    name: validData.name,
    description: validData.description,
    data: validData.data,
    type: type.id,
    value: validData.value,
    user: data.user,
  });

  return notification;
};

// archive services
export const archiveNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId,
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { archived: true },
    { new: true },
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND,
    );

  return updatedNotification;
};

export const unarchiveNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId,
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { archived: false },
    { new: true },
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND,
    );

  return updatedNotification;
};

export const archiveAllNotificationsService = async (
  user: mongoose.Types.ObjectId,
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { archived: true },
    { new: true },
  );

  return updatedNotification;
};

export const unarchiveAllNotificationsService = async (
  user: mongoose.Types.ObjectId,
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { archived: false },
    { new: true },
  );

  return updatedNotification;
};

// read services
export const readNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId,
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { read: true },
    { new: true },
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND,
    );

  return updatedNotification;
};

export const unreadNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId,
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { read: false },
    { new: true },
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND,
    );

  return updatedNotification;
};

export const readAllNotificationsService = async (
  user: mongoose.Types.ObjectId,
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { read: true },
    { new: true },
  );

  return updatedNotification;
};

export const unreadAllNotificationsService = async (
  user: mongoose.Types.ObjectId,
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { read: false },
    { new: true },
  );

  return updatedNotification;
};

// delete services
export const deleteNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId,
) => {
  const validId = z.string().parse(id);

  const notification = await Notification.findOneAndUpdate(
    {
      user,
      _id: validId,
    },
    { dismissed: true },
    { new: true },
  );

  if (!notification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND,
    );

  return notification;
};

export const clearNotificationsService = async (
  user: mongoose.Types.ObjectId,
) => {
  await Notification.updateMany(
    {
      user,
    },
    { dismissed: true },
  );
};
