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
exports.getNotificationTypes = exports.createNotificationType = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const notification_type_service_1 = require("../service/notification-type.service");
const http_status_codes_1 = require("http-status-codes");
const getNotificationTypes = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const types = yield (0, notification_type_service_1.getNotificationTypesService)();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notifications types fetched successfully",
        data: {
            types,
        },
    });
}));
exports.getNotificationTypes = getNotificationTypes;
const createNotificationType = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const type = yield (0, notification_type_service_1.createNotificationTypeService)(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Notification created successfully",
        data: {
            type,
        },
    });
}));
exports.createNotificationType = createNotificationType;
