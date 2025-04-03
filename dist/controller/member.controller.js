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
exports.inviteMember = exports.getMember = exports.getMembers = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const member_model_1 = __importStar(require("../model/member.model"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const user_model_1 = __importDefault(require("../model/user.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const project_model_1 = __importDefault(require("../model/project.model"));
exports.getMembers = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield member_model_1.default.find({
        activated: true,
    })
        .populate("user", "name email avatar")
        .select("-memberships");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Members fetched successfully",
        data: {
            members,
        },
    });
}));
exports.getMember = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validEmail = zod_1.z
        .string()
        .email("Not a valid email")
        .parse(req.params.email);
    const user = yield user_model_1.default.findOne({
        email: validEmail,
    });
    if (!user)
        return next(new app_error_1.default("No member found with this email", http_status_codes_1.StatusCodes.NOT_FOUND));
    const member = yield member_model_1.default.findOne({
        user: user._id,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: {
            member,
        },
    });
}));
exports.inviteMember = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(req.params.id);
    const validData = zod_1.z
        .object({
        entity: zod_1.z.string(),
        entityType: zod_1.z.enum(member_model_1.MEMBER_ENTITY_TYPES),
    })
        .strict()
        .parse(req.body);
    let entity;
    if (validData.entityType === "project")
        entity = yield project_model_1.default.findById(validData.entity);
    if (!entity)
        return next(new app_error_1.default("An entity id must be provided", http_status_codes_1.StatusCodes.BAD_REQUEST));
    const member = yield member_model_1.default.findByIdAndUpdate(validId, {
        memberships: {
            $push: {
                entity,
                entityType: validData.entityType,
            },
        },
    }, { new: true }).populate("user", "name email avatar");
    if (!member)
        return next(new app_error_1.default("No member found with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `Invitation request has been sent to ${member.user.email}`,
    });
}));
