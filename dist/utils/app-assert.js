"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const app_error_1 = __importDefault(require("./app-error"));
/**
 * Asserts a condition and throws an AppError if the condition is falsy
 */
const appAssert = (condition, message, httpStatusCode, appErrorCode) => (0, node_assert_1.default)(condition, new app_error_1.default(message, httpStatusCode, appErrorCode));
exports.default = appAssert;
