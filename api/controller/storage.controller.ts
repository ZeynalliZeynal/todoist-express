import catchErrors from "../utils/catch-errors";
import { StatusCodes } from "http-status-codes";
import {
  deleteFileService,
  uploadFileService,
} from "../service/storage.service";
import User from "../model/user.model";
import AppError from "../utils/app-error";

export const uploadFile = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user)
    return next(new AppError("User does not exist", StatusCodes.NOT_FOUND));

  if (!req.file)
    return next(
      new AppError("No file was specified.", StatusCodes.BAD_REQUEST),
    );

  const fileUrl = await uploadFileService({
    buffer: req.file?.buffer,
    contentType: req.file?.mimetype,
    existingFilename: !user.avatar.includes("avatar.vercel.sh")
      ? user.avatar.split("/").at(-1)?.split("?").at(0)
      : undefined,
    prefix: req.params.prefix,
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "File uploaded successfully",
    data: {
      fileUrl: fileUrl,
    },
  });
});

export const deleteFile = catchErrors(async (req, res, next) => {
  if (!req.params.prefix)
    return next(new AppError("Prefix is required.", StatusCodes.BAD_REQUEST));

  if (!req.params.filename)
    return next(
      new AppError("File filename is required.", StatusCodes.BAD_REQUEST),
    );

  await deleteFileService({
    filename: req.params.filename,
    prefix: req.params.prefix,
  });

  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    message: "File deleted successfully",
  });
});
