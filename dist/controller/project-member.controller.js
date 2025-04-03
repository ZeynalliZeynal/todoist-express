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
exports.rejectProjectMemberRequest = exports.approveProjectMemberRequest = exports.getProjectMembers = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const zod_1 = require("zod");
const member_model_1 = __importDefault(require("../model/member.model"));
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = __importDefault(require("../utils/app-error"));
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
    const validProjectId = zod_1.z.string().parse(req.params.id);
    const memberships = yield member_model_1.default.findOneAndUpdate({
        "memberships.entity": validProjectId,
        "memberships.status": "pending",
        "memberships.invited": false,
    }, { $set: { "memberships.$.status": "approved" } }, { new: true }).populate("user", "name email avatar");
    if (!memberships)
        return next(new app_error_1.default("There is no request yet", http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: { memberships },
    });
}));
exports.rejectProjectMemberRequest = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validProjectId = zod_1.z.string().parse(req.params.id);
    const memberships = yield member_model_1.default.findOneAndUpdate({
        "memberships.entity": validProjectId,
        "memberships.status": "pending",
        "memberships.invited": false,
    }, { $set: { "memberships.$.status": "rejected" } }, { new: true }).populate("user", "name email avatar");
    if (!memberships)
        return next(new app_error_1.default("There is no request yet", http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: { memberships },
    });
}));
