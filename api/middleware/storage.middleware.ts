import { RequestHandler } from "express";
import catchErrors from "../utils/catch-errors";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import {
  BUCKET_PREFIXES,
  isValidBucketPrefix,
} from "../constants/bucket-prefixes";

export const checkBucketPrefix: RequestHandler = catchErrors(
  async (req, res, next) => {
    // check if prefix exists
    if (!req.params.prefix)
      return next(new AppError("Prefix is required.", StatusCodes.BAD_REQUEST));

    // check bucket prefix
    if (!isValidBucketPrefix(req.params.prefix))
      return next(
        new AppError(
          `Please specify a valid prefix that exists in the storage. One of [${Object.values(BUCKET_PREFIXES).join(", ")}].`,
          StatusCodes.BAD_REQUEST,
        ),
      );

    next();
  },
);
