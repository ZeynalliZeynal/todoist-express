"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.rejectProjectMemberRequest = exports.approveProjectMemberRequest = exports.getProjectMembers = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const zod_1 = require("zod");
const member_model_1 = __importDefault(require("../model/member.model"));
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = __importDefault(require("../utils/app-error"));
const notification_constant_1 = require("../constants/notification.constant");
const notification_model_1 = __importStar(require("../model/notification.model"));
const notification_type_model_1 = __importDefault(require("../model/notification-type.model"));
exports.getProjectMembers = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validProjectId = zod_1.z.string().parse(req.params.id);
    const members = yield member_model_1.default.find({
        "memberships.entity": validProjectId,
    }).populate("user", "name email avatar");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: {
            members,
        },
    });
}));
exports.approveProjectMemberRequest = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z.record(zod_1.z.any()).parse(req.body);
    const [memberships, notificationType] = yield Promise.all([
        member_model_1.default.findOneAndUpdate({
            user: req.userId,
            "memberships.entity._id": validData._id,
            "memberships.status": "pending",
            "memberships.invited": false,
        }, { $set: { "memberships.$.status": "approved" } }, { new: true }).populate("user", "name email avatar"),
        notification_type_model_1.default.findOne({
            name: notification_model_1.NotificationTypeEnum.MEMBER_INVITATION_APPROVED,
        }),
    ]);
    if (!memberships)
        return next(new app_error_1.default("There is no request yet", http_status_codes_1.StatusCodes.NOT_FOUND));
    yield notification_model_1.default.create({
        name: (0, notification_constant_1.generateNotificationName)(notification_model_1.NotificationTypeEnum.MEMBER_INVITATION_APPROVED, [
            memberships.user.name,
            memberships.memberships[0].entity.name,
        ]),
        description: "You approved an invitation!",
        data: memberships.memberships[0].entity,
        value: validData.entity._id,
        user: memberships.user._id,
        type: notificationType === null || notificationType === void 0 ? void 0 : notificationType._id,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: { memberships },
    });
}));
exports.rejectProjectMemberRequest = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z.record(zod_1.z.any()).parse(req.body);
    const [memberships, notificationType] = yield Promise.all([
        member_model_1.default.findOneAndUpdate({
            user: req.userId,
            "memberships.entity._id": validData._id,
            "memberships.status": "pending",
            "memberships.invited": false,
        }, { $set: { "memberships.$.status": "rejected" } }, { new: true }).populate("user", "name email avatar"),
        notification_type_model_1.default.findOne({
            name: notification_model_1.NotificationTypeEnum.MEMBER_INVITATION_REJECTED,
        }),
    ]);
    if (!memberships)
        return next(new app_error_1.default("There is no request yet", http_status_codes_1.StatusCodes.NOT_FOUND));
    yield notification_model_1.default.create({
        name: (0, notification_constant_1.generateNotificationName)(notification_model_1.NotificationTypeEnum.MEMBER_INVITATION_REJECTED, [
            memberships.user.name,
            memberships.memberships[0].entity.name,
        ]),
        description: "You rejected an invitation!",
        data: memberships.memberships[0].entity,
        value: validData.entity._id,
        user: memberships.user._id,
        type: notificationType === null || notificationType === void 0 ? void 0 : notificationType._id,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: { memberships },
    });
}));
