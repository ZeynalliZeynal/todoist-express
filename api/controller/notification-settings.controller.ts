import { StatusCodes } from "http-status-codes";
import NotificationSettingsModel from "../model/notification-settings.model";
import catchErrors from "../utils/catch-errors";
import ResponseStatues from "../constants/response-statues";
import {
  disableNotificationService,
  enableNotificationService,
} from "../service/notification-settings.service";

const getNotificationSettings = catchErrors(async (req, res, next) => {
  const settings = await NotificationSettingsModel.findOne({
    user: req.userId,
  }).populate("preferences.type");

  const groupedSettings: Record<string, any[]> = {};

  settings?.preferences.forEach((pref) => {
    const category = (pref.type as any)?.name.split("/")[0];

    if (!groupedSettings[category]) {
      groupedSettings[category] = [];
    }

    groupedSettings[category].push(pref);
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Notification settings fetched successfully",
    data: {
      settings: groupedSettings,
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
    message: `${setting.label} notification type enabled`,
  });
});

const disableNotification = catchErrors(async (req, res, next) => {
  const setting = await disableNotificationService({
    userId: req.userId,
    typeId: req.params.id,
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: `${setting.label} notification type disabled`,
  });
});

export { getNotificationSettings, enableNotification, disableNotification };
