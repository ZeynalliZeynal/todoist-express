import AppError from "../utils/app-error";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { MongoServerError } from "mongodb";
import { clearAuthCookies, refresh_path } from "../utils/cookies";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return res.status(StatusCodes.BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const handleAppError = (res: Response, error: AppError) =>
  res.status(error.statusCode).json({
    status: "fail",
    message: error.message,
    errorCode: error.errorCode,
  });

const handleDuplicateValueError = (res: Response, error: MongoServerError) => {
  const value = error.errorResponse.errmsg
    ?.match(/(["'])(?:(?=(\\?))\2.)*?\1/)
    ?.at(0);
  const message = `Duplicate field value: ${value}. Please use another value.`;
  res.status(StatusCodes.BAD_REQUEST).json({
    status: "fail",
    message,
  });
};

const handleValidationError = (res: Response, error: MongoServerError) => {
  console.log(Object.values(error.errors));
  const message = Object.values(error.errors).map((value: any) => ({
    message: value.message,
    path: value.path,
  }));

  return res.status(StatusCodes.BAD_REQUEST).json({
    status: "fail",
    message,
  });
};

const handleTokenExpiredError = (res: Response, error: TokenExpiredError) =>
  res.status(StatusCodes.UNAUTHORIZED).json({
    status: "fail",
    message: "Token is expired. Try again.",
  });

const handleInvalidSignatureError = (res: Response, error: JsonWebTokenError) =>
  res.status(StatusCodes.UNAUTHORIZED).json({
    status: "fail",
    message: "Token is invalid.",
  });

type ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err, err.name);
  if (req.path === refresh_path) clearAuthCookies(res);

  if (err instanceof z.ZodError) handleZodError(res, err);

  if (err instanceof AppError) handleAppError(res, err);

  if (err.name === "ValidationError")
    handleValidationError(res, err as MongoServerError);

  if ((err as MongoServerError).code == 11000)
    handleDuplicateValueError(res, err as MongoServerError);

  if (err instanceof TokenExpiredError)
    handleTokenExpiredError(res, err as TokenExpiredError);
  if (err instanceof JsonWebTokenError || err.name === "invalid signature")
    handleInvalidSignatureError(res, err as JsonWebTokenError);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Initial server error",
  });
};
