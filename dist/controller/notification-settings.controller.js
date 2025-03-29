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
exports.disableNotification = exports.enableNotification = exports.getNotificationSettings = void 0;
const http_status_codes_1 = require("http-status-codes");
const notification_settings_model_1 = __importDefault(require("../model/notification-settings.model"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const notification_settings_service_1 = require("../service/notification-settings.service");
const getNotificationSettings = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield notification_settings_model_1.default.findOne({
        user: req.userId,
    }).populate("preferences.type");
    const groupedSettings = {};
    settings === null || settings === void 0 ? void 0 : settings.preferences.forEach((pref) => {
        var _a;
        const category = (_a = pref.type) === null || _a === void 0 ? void 0 : _a.name.split("/")[0];
        if (!groupedSettings[category]) {
            groupedSettings[category] = [];
        }
        groupedSettings[category].push(pref);
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification settings fetched successfully",
        data: {
            settings: groupedSettings,
        },
    });
}));
exports.getNotificationSettings = getNotificationSettings;
const enableNotification = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = yield (0, notification_settings_service_1.enableNotificationService)({
        userId: req.userId,
        typeId: req.params.id,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `${setting.label} notification type enabled`,
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
        message: `${setting.label} notification type disabled`,
    });
}));
exports.disableNotification = disableNotification;
