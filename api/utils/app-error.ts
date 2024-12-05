import { Error } from "mongoose";
import { StatusCodes } from "http-status-codes";
import ErrorCodes from "../constants/error-codes";

class AppError extends Error {
  public status: "fail" | "error";
  public isOperational: boolean;

  constructor(
    public message: string,
    public statusCode: StatusCodes,
    public errorCode?: ErrorCodes,
  ) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
