import catchErrors from "../utils/catch-errors";
import PermissionModel from "../model/permission.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";
import AppError from "../utils/app-error";
import {
  createPermissionService,
  deletePermissionService,
} from "../service/permission.service";

export const getPermissions = catchErrors(async (req, res) => {
  const permissions = await PermissionModel.find();

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Permissions fetched successfully",
    data: {
      permissions,
    },
  });
});

export const getPermission = catchErrors(async (req, res, next) => {
  const permission = await PermissionModel.findById(req.params.id);

  if (!permission)
    return next(
      new AppError(
        `Not found permission found with id ${req.params.id}`,
        StatusCodes.NOT_FOUND,
      ),
    );

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Permission fetched successfully",
    data: {
      permission,
    },
  });
});

export const createPermission = catchErrors(async (req, res) => {
  const permission = await createPermissionService(req.body);
  res.status(StatusCodes.CREATED).json({
    status: ResponseStatues.SUCCESS,
    message: "Permission created successfully",
    data: {
      permission,
    },
  });
});

export const deletePermission = catchErrors(async (req, res) => {
  await deletePermissionService(req.params.id);

  res.status(StatusCodes.NO_CONTENT).json({
    status: ResponseStatues.SUCCESS,
    message: "Permission deleted successfully",
  });
});
