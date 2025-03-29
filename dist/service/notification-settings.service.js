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
exports.disableNotificationService = exports.enableNotificationService = void 0;
const zod_1 = require("zod");
const notification_settings_model_1 = __importDefault(require("../model/notification-settings.model"));
const notification_type_model_1 = __importDefault(require("../model/notification-type.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const enableNotificationService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, typeId, }) {
    const validType = zod_1.z.string().parse(typeId);
    const type = yield notification_type_model_1.default.findById(validType);
    if (!type)
        throw new app_error_1.default("Notification type not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    yield notification_settings_model_1.default.findOneAndUpdate({
        user: userId,
        "preferences.type": validType,
    }, { $set: { "preferences.$.enabled": true } });
    return type;
});
exports.enableNotificationService = enableNotificationService;
const disableNotificationService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, typeId, }) {
    const validType = zod_1.z.string().parse(typeId);
    const type = yield notification_type_model_1.default.findById(validType);
    if (!type)
        throw new app_error_1.default("Notification type not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    yield notification_settings_model_1.default.findOneAndUpdate({
        user: userId,
        "preferences.type": validType,
    }, { $set: { "preferences.$.enabled": false } });
    return type;
});
exports.disableNotificationService = disableNotificationService;
