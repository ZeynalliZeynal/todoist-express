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
exports.createNotificationTypeService = exports.getNotificationTypesService = void 0;
const notification_type_model_1 = __importDefault(require("../model/notification-type.model"));
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const notification_settings_model_1 = __importDefault(require("../model/notification-settings.model"));
const getNotificationTypesService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield notification_type_model_1.default.find().sort("-name");
    }
    catch (error) {
        throw error;
    }
});
exports.getNotificationTypesService = getNotificationTypesService;
const createNotificationTypeService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validData = zod_1.z
            .object({
            name: zod_1.z.string().min(3, "Minimum 3 characters required").trim(),
            label: zod_1.z
                .string()
                .min(3, "Minimum 3 characters required")
                .regex(/^[A-Za-z\s]+$/, {
                message: "Label must contain only letters",
            })
                .trim(),
            description: zod_1.z.string().trim().optional(),
        })
            .parse(data);
        const existingData = yield notification_type_model_1.default.exists({
            name: validData.name,
        });
        if (existingData)
            throw new app_error_1.default(`Notification type with the name ${validData.name} already exists. Please use another name.`, http_status_codes_1.StatusCodes.BAD_REQUEST);
        const type = yield notification_type_model_1.default.create({
            name: validData.name,
            label: validData.label,
            description: validData.description,
        });
        // update settings for all users
        yield notification_settings_model_1.default.updateMany({}, {
            $push: {
                preferences: {
                    type: type._id,
                    enabled: true,
                },
            },
        });
        return type;
    }
    catch (error) {
        throw error;
    }
});
exports.createNotificationTypeService = createNotificationTypeService;
