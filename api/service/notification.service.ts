import Notification, { NotificationProps } from "../model/notification.model";
import { notificationValidator } from "../validator/notification.validator";
import { z } from "zod";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// create service
interface CreateNotificationProps {
  name: string;
  description?: string;
  data: object;
  type: NotificationProps;
  value: string;
  user: string;
}

export const createNotificationService = async (
  data: CreateNotificationProps
) => {
  const validData = notificationValidator.parse(data);

  const notification = await Notification.create({
    name: validData.name,
    description: validData.description,
    data: validData.data,
    type: validData.type,
    value: validData.value,
    user: data.user,
  });

  return notification;
};

// archive services
export const archiveNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { archived: true },
    { new: true }
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND
    );

  return updatedNotification;
};

export const unarchiveNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { archived: false },
    { new: true }
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND
    );

  return updatedNotification;
};

export const archiveAllNotificationsService = async (
  user: mongoose.Types.ObjectId
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { archived: true },
    { new: true }
  );

  return updatedNotification;
};

export const unarchiveAllNotificationsService = async (
  user: mongoose.Types.ObjectId
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { archived: false },
    { new: true }
  );

  return updatedNotification;
};

// read services
export const readNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { read: true },
    { new: true }
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND
    );

  return updatedNotification;
};

export const unreadNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId
) => {
  const validId = z.string().parse(id);

  const updatedNotification = await Notification.findOneAndUpdate(
    { user, _id: validId },
    { read: false },
    { new: true }
  );

  if (!updatedNotification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND
    );

  return updatedNotification;
};

export const readAllNotificationsService = async (
  user: mongoose.Types.ObjectId
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { read: true },
    { new: true }
  );

  return updatedNotification;
};

export const unreadAllNotificationsService = async (
  user: mongoose.Types.ObjectId
) => {
  const updatedNotification = await Notification.updateMany(
    { user },
    { read: false },
    { new: true }
  );

  return updatedNotification;
};

// delete services
export const deleteNotificationService = async (
  id: string,
  user: mongoose.Types.ObjectId
) => {
  const validId = z.string().parse(id);

  const notification = await Notification.findOneAndDelete({
    user,
    _id: validId,
  });

  if (!notification)
    throw new AppError(
      `No notification found with the id ${validId}`,
      StatusCodes.NOT_FOUND
    );

  return notification;
};

export const clearNotificationsService = async (
  user: mongoose.Types.ObjectId
) => {
  await Notification.deleteMany({
    user,
  });
};
