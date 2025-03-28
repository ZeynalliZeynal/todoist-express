import catchErrors from "../utils/catch-errors";
import {
  createNotificationTypeService,
  getNotificationTypesService,
} from "../service/notification-type.service";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";

const getNotificationTypes = catchErrors(async (req, res, next) => {
  const types = await getNotificationTypesService();

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Notifications types fetched successfully",
    data: {
      types,
    },
  });
});

const createNotificationType = catchErrors(async (req, res, next) => {
  const type = await createNotificationTypeService(req.body);

  res.status(StatusCodes.CREATED).json({
    status: ResponseStatues.SUCCESS,
    message: "Notification created successfully",
    data: {
      type,
    },
  });
});

export { createNotificationType, getNotificationTypes };
