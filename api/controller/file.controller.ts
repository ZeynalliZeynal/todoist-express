import catchErrors from "../utils/catch-errors";
import { StatusCodes } from "http-status-codes";
import { deleteFileService, uploadFileService } from "../service/file.service";
import User from "../model/user.model";
import AppError from "../utils/app-error";

export const uploadFile = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user)
    return next(new AppError("User does not exist", StatusCodes.NOT_FOUND));

  const fileUrl = await uploadFileService({
    buffer: req.file?.buffer,
    contentType: req.file?.mimetype,
    existingFilename: !user.avatar.includes("avatar.vercel.sh")
      ? user.avatar.split("/").at(-1)?.split("?").at(0)
      : undefined,
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
  // const filename = req.file?.originalname.split(" ").join("_");

  await deleteFileService({ filename: req.params.filename });
  res.status(StatusCodes.NO_CONTENT).json({
    status: "success",
    message: "File deleted successfully",
  });
});
