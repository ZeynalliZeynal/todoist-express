import catchErrors from "../utils/catch-errors";
import { NextFunction, Request, Response } from "express";
import Notification from "../model/notification.model";
import { StatusCodes } from "http-status-codes";
import AppError from "../utils/app-error";
import {
  archiveAllNotificationsService,
  archiveNotificationService,
  clearNotificationsService,
  createNotificationService,
  deleteNotificationService,
  readAllNotificationsService,
  readNotificationService,
  unarchiveAllNotificationsService,
  unarchiveNotificationService,
  unreadAllNotificationsService,
  unreadNotificationService,
} from "../service/notification.service";
import ResponseStatues from "../constants/response-statues";

const getNotifications = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await Notification.find({
      user: req.userId,
    });

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notifications fetched successfully",
      data: {
        notifications,
      },
    });
  }
);

const getNotification = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id)
      return next(new AppError("ID is required", StatusCodes.BAD_REQUEST));

    const notification = await Notification.findOne({
      user: req.userId,
      _id: req.params.id,
    });

    if (!notification)
      return next(
        new AppError(
          `No notification found with the id ${req.params.id}`,
          StatusCodes.NOT_FOUND
        )
      );

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notification fetched successfully",
      data: {
        notification,
      },
    });
  }
);

const createNotification = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    const notification = await createNotificationService({
      ...data,
      user: req.userId,
    });

    res.status(StatusCodes.CREATED).json({
      status: ResponseStatues.SUCCESS,
      message: "Notification created successfully",
      data: {
        notification,
      },
    });
  }
);

// archive
const archiveNotification = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const notification = await archiveNotificationService(id, req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notification archived successfully",
      data: {
        notification,
      },
    });
  }
);

const unarchiveNotification = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const notification = await unarchiveNotificationService(id, req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notification unarchived successfully",
      data: {
        notification,
      },
    });
  }
);

const archiveAllNotifications = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await archiveAllNotificationsService(req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notifications archived successfully",
    });
  }
);

const unarchiveAllNotifications = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await unarchiveAllNotificationsService(req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notifications unarchived successfully",
    });
  }
);

// read
const readNotification = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const notification = await readNotificationService(id, req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notification read successfully",
      data: {
        notification,
      },
    });
  }
);

const unreadNotification = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const notification = await unreadNotificationService(id, req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notification unread successfully",
      data: {
        notification,
      },
    });
  }
);

const readAllNotifications = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await readAllNotificationsService(req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notifications read successfully",
    });
  }
);

const unreadAllNotifications = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await unreadAllNotificationsService(req.userId);

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "Notifications unread successfully",
    });
  }
);

// delete
const deleteNotification = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await deleteNotificationService(id, req.userId);

    res.status(StatusCodes.NO_CONTENT).json({
      status: ResponseStatues.SUCCESS,
      message: "Notification deleted successfully",
    });
  }
);

const clearNotifications = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await clearNotificationsService(req.userId);

    res.status(StatusCodes.NO_CONTENT).json({
      status: ResponseStatues.SUCCESS,
      message: "Notifications cleared successfully",
    });
  }
);

export {
  createNotification,
  getNotifications,
  getNotification,
  archiveAllNotifications,
  archiveNotification,
  unarchiveAllNotifications,
  unarchiveNotification,
  readAllNotifications,
  readNotification,
  unreadAllNotifications,
  unreadNotification,
  deleteNotification,
  clearNotifications,
};
