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
exports.clearNotificationsService = exports.deleteNotificationService = exports.unreadAllNotificationsService = exports.readAllNotificationsService = exports.unreadNotificationService = exports.readNotificationService = exports.unarchiveAllNotificationsService = exports.archiveAllNotificationsService = exports.unarchiveNotificationService = exports.archiveNotificationService = exports.createNotificationService = exports.getNotificationService = exports.getNotificationsService = void 0;
const notification_model_1 = __importDefault(require("../model/notification.model"));
const notification_validator_1 = require("../validator/notification.validator");
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const notification_type_model_1 = __importDefault(require("../model/notification-type.model"));
// get services
const getNotificationsService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_model_1.default.find({
            user,
            dismissed: { $ne: true },
        })
            .populate("type")
            .sort("-createdAt");
        return notifications;
    }
    catch (error) {
        throw error;
    }
});
exports.getNotificationsService = getNotificationsService;
const getNotificationService = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validId = zod_1.z.string().min(1, "Id is required").parse(id);
        const notification = yield notification_model_1.default.findOne({
            user,
            _id: validId,
            dismissed: { $ne: true },
        });
        return notification;
    }
    catch (error) {
        throw error;
    }
});
exports.getNotificationService = getNotificationService;
const createNotificationService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = notification_validator_1.notificationValidator.parse(data);
    const type = yield notification_type_model_1.default.findOne({
        name: validData.type,
    });
    if (!type)
        throw new app_error_1.default(`No notification type found with the name "${validData.type}"`, http_status_codes_1.StatusCodes.NOT_FOUND);
    const notification = yield notification_model_1.default.create({
        name: validData.name,
        description: validData.description,
        data: validData.data,
        type: type.id,
        value: validData.value,
        user: data.user,
    });
    return notification;
});
exports.createNotificationService = createNotificationService;
// archive services
const archiveNotificationService = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(id);
    const updatedNotification = yield notification_model_1.default.findOneAndUpdate({ user, _id: validId }, { archived: true }, { new: true });
    if (!updatedNotification)
        throw new app_error_1.default(`No notification found with the id ${validId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    return updatedNotification;
});
exports.archiveNotificationService = archiveNotificationService;
const unarchiveNotificationService = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(id);
    const updatedNotification = yield notification_model_1.default.findOneAndUpdate({ user, _id: validId }, { archived: false }, { new: true });
    if (!updatedNotification)
        throw new app_error_1.default(`No notification found with the id ${validId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    return updatedNotification;
});
exports.unarchiveNotificationService = unarchiveNotificationService;
const archiveAllNotificationsService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedNotification = yield notification_model_1.default.updateMany({ user }, { archived: true }, { new: true });
    return updatedNotification;
});
exports.archiveAllNotificationsService = archiveAllNotificationsService;
const unarchiveAllNotificationsService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedNotification = yield notification_model_1.default.updateMany({ user }, { archived: false }, { new: true });
    return updatedNotification;
});
exports.unarchiveAllNotificationsService = unarchiveAllNotificationsService;
// read services
const readNotificationService = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(id);
    const updatedNotification = yield notification_model_1.default.findOneAndUpdate({ user, _id: validId }, { read: true }, { new: true });
    if (!updatedNotification)
        throw new app_error_1.default(`No notification found with the id ${validId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    return updatedNotification;
});
exports.readNotificationService = readNotificationService;
const unreadNotificationService = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(id);
    const updatedNotification = yield notification_model_1.default.findOneAndUpdate({ user, _id: validId }, { read: false }, { new: true });
    if (!updatedNotification)
        throw new app_error_1.default(`No notification found with the id ${validId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    return updatedNotification;
});
exports.unreadNotificationService = unreadNotificationService;
const readAllNotificationsService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedNotification = yield notification_model_1.default.updateMany({ user }, { read: true }, { new: true });
    return updatedNotification;
});
exports.readAllNotificationsService = readAllNotificationsService;
const unreadAllNotificationsService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedNotification = yield notification_model_1.default.updateMany({ user }, { read: false }, { new: true });
    return updatedNotification;
});
exports.unreadAllNotificationsService = unreadAllNotificationsService;
// delete services
const deleteNotificationService = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(id);
    const notification = yield notification_model_1.default.findOneAndUpdate({
        user,
        _id: validId,
    }, { dismissed: true }, { new: true });
    if (!notification)
        throw new app_error_1.default(`No notification found with the id ${validId}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    return notification;
});
exports.deleteNotificationService = deleteNotificationService;
const clearNotificationsService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield notification_model_1.default.updateMany({
        user,
    }, { dismissed: true });
});
exports.clearNotificationsService = clearNotificationsService;
