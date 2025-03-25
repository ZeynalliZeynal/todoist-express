"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const user_model_1 = __importDefault(require("../model/user.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const task_model_1 = __importDefault(require("../model/task.model"));
const project_model_1 = __importDefault(require("../model/project.model"));
const notification_model_1 = __importDefault(require("../model/notification.model"));
exports.getProfile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.userId)
        .populate("plan")
        .populate("tasks")
        .populate("notifications")
        .populate("projects");
    const taskCount = yield task_model_1.default.countDocuments({
        user: req.userId,
    });
    const projectCount = yield project_model_1.default.countDocuments({
        user: req.userId,
    });
    const notificationCount = yield notification_model_1.default.countDocuments({
        user: req.userId,
    });
    if (!user)
        return next(new app_error_1.default("No user found. You may not be logged in.", http_status_codes_1.StatusCodes.NOT_FOUND));
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            taskCount,
            projectCount,
            notificationCount,
            user,
        },
    });
}));
exports.updateProfile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndUpdate(req.userId, {
        name: req.body.name,
        avatar: req.body.avatar,
    }, { new: true, runValidators: true });
    if (!user)
        return next(new app_error_1.default("No user found. You may not be logged in.", http_status_codes_1.StatusCodes.NOT_FOUND));
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Profile successfully updated.",
        data: {
            user,
        },
    });
}));
