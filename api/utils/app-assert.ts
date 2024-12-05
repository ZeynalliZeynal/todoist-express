import assert from "node:assert";
import AppError from "./app-error";
import ErrorCodes from "../constants/error-codes";
import {StatusCodes} from "http-status-codes";

/**
 * Asserts a condition and throws an AppError if the condition is falsy
 */

const appAssert = (
  condition: any,
  message: string,
  httpStatusCode: StatusCodes,
  appErrorCode?: ErrorCodes,
) => assert(condition, new AppError(message, httpStatusCode, appErrorCode));

export default appAssert;
