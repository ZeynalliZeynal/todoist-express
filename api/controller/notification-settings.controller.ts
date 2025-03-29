import { StatusCodes } from "http-status-codes";
import NotificationSettingsModel from "../model/notification-settings.model";
import catchErrors from "../utils/catch-errors";
import ResponseStatues from "../constants/response-statues";
import {
  disableNotificationService,
  enableNotificationService,
} from "../service/notification-settings.service";

const getAllNotificationSettings = catchErrors(async (req, res, next) => {
  const settings = await NotificationSettingsModel.find({
    user: req.userId,
  }).populate("preferences.type");

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Notification settings fetched successfully",
    data: {
      settings,
    },
  });
});

const enableNotification = catchErrors(async (req, res, next) => {
  const setting = await enableNotificationService({
    userId: req.userId,
    typeId: req.params.id,
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `${setting.name} notification type enabled`,
  });
});

const disableNotification = catchErrors(async (req, res, next) => {
  const setting = await disableNotificationService({
    userId: req.userId,
    typeId: req.params.id,
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `${setting.name} notification type enabled`,
  });
});

export { getAllNotificationSettings, enableNotification, disableNotification };
