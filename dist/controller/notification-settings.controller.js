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
exports.disableNotification = exports.enableNotification = exports.getAllNotificationSettings = void 0;
const http_status_codes_1 = require("http-status-codes");
const notification_settings_model_1 = __importDefault(require("../model/notification-settings.model"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const notification_settings_service_1 = require("../service/notification-settings.service");
const getAllNotificationSettings = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield notification_settings_model_1.default.find({
        user: req.userId,
    }).populate("preferences.type");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification settings fetched successfully",
        data: {
            settings,
        },
    });
}));
exports.getAllNotificationSettings = getAllNotificationSettings;
const enableNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield (0, notification_settings_service_1.enableNotificationService)({
        userId: req.userId,
        typeId: req.params.id,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `${setting.name} notification type enabled`,
    });
}));
exports.enableNotification = enableNotification;
const disableNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield (0, notification_settings_service_1.disableNotificationService)({
        userId: req.userId,
        typeId: req.params.id,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `${setting.name} notification type enabled`,
    });
}));
exports.disableNotification = disableNotification;
