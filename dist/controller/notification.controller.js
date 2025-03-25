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
exports.clearNotifications = exports.deleteNotification = exports.unreadNotification = exports.unreadAllNotifications = exports.readNotification = exports.readAllNotifications = exports.unarchiveNotification = exports.unarchiveAllNotifications = exports.archiveNotification = exports.archiveAllNotifications = exports.getNotification = exports.getNotifications = exports.createNotification = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const notification_model_1 = __importDefault(require("../model/notification.model"));
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = __importDefault(require("../utils/app-error"));
const notification_service_1 = require("../service/notification.service");
const getNotifications = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_model_1.default.find({
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notifications fetched successfully",
        data: {
            notifications,
        },
    });
}));
exports.getNotifications = getNotifications;
const getNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id)
        return next(new app_error_1.default("ID is required", http_status_codes_1.StatusCodes.BAD_REQUEST));
    const notification = yield notification_model_1.default.findOne({
        user: req.userId,
        _id: req.params.id,
    });
    if (!notification)
        return next(new app_error_1.default(`No notification found with the id ${req.params.id}`, http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification fetched successfully",
        data: {
            notification,
        },
    });
}));
exports.getNotification = getNotification;
const createNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const notification = yield (0, notification_service_1.createNotificationService)(Object.assign(Object.assign({}, data), { user: req.userId }));
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification created successfully",
        data: {
            notification,
        },
    });
}));
exports.createNotification = createNotification;
// archive
const archiveNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const notification = yield (0, notification_service_1.archiveNotificationService)(id, req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification archived successfully",
        data: {
            notification,
        },
    });
}));
exports.archiveNotification = archiveNotification;
const unarchiveNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const notification = yield (0, notification_service_1.unarchiveNotificationService)(id, req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification unarchived successfully",
        data: {
            notification,
        },
    });
}));
exports.unarchiveNotification = unarchiveNotification;
const archiveAllNotifications = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, notification_service_1.archiveAllNotificationsService)(req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notifications archived successfully",
    });
}));
exports.archiveAllNotifications = archiveAllNotifications;
const unarchiveAllNotifications = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, notification_service_1.unarchiveAllNotificationsService)(req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notifications unarchived successfully",
    });
}));
exports.unarchiveAllNotifications = unarchiveAllNotifications;
// read
const readNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const notification = yield (0, notification_service_1.readNotificationService)(id, req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification read successfully",
        data: {
            notification,
        },
    });
}));
exports.readNotification = readNotification;
const unreadNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const notification = yield (0, notification_service_1.unreadNotificationService)(id, req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification unread successfully",
        data: {
            notification,
        },
    });
}));
exports.unreadNotification = unreadNotification;
const readAllNotifications = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, notification_service_1.readAllNotificationsService)(req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notifications read successfully",
    });
}));
exports.readAllNotifications = readAllNotifications;
const unreadAllNotifications = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, notification_service_1.unreadAllNotificationsService)(req.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notifications unread successfully",
    });
}));
exports.unreadAllNotifications = unreadAllNotifications;
// delete
const deleteNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield (0, notification_service_1.deleteNotificationService)(id, req.userId);
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification deleted successfully",
    });
}));
exports.deleteNotification = deleteNotification;
const clearNotifications = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, notification_service_1.clearNotificationsService)(req.userId);
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notifications cleared successfully",
    });
}));
exports.clearNotifications = clearNotifications;
