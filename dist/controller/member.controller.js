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
exports.rejectMembershipInvitation = exports.approveMembershipInvitation = exports.requestToJoinAsMember = exports.inviteMembers = exports.inviteMember = exports.createMembershipProfile = exports.getMember = exports.getMembers = exports.getMembershipsProfile = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const member_model_1 = __importStar(require("../model/member.model"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const user_model_1 = __importDefault(require("../model/user.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const project_model_1 = __importDefault(require("../model/project.model"));
exports.getMembershipsProfile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield member_model_1.default.findOne({
        user: req.userId,
    }).populate("user", "name email avatar location online");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: {
            profile,
        },
    });
}));
exports.getMembers = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield member_model_1.default.find({
        memberships: {
            $elemMatch: {
                $or: [{ status: "pending" }, { entity: { $exists: false } }],
            },
        },
        user: { $ne: req.userId },
        activated: true,
    })
        .populate("user", "name email avatar location online lastOnline")
        .populate("memberships.entity")
        .select("-memberships.permissions -activated");
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
    })
        .populate("user", "name email avatar location")
        .select("-memberships.permissions -activated");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        data: {
            member,
        },
    });
}));
exports.createMembershipProfile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield member_model_1.default.exists({
        user: req.userId,
    });
    if (existing)
        return next(new app_error_1.default("You have already a membership profile", http_status_codes_1.StatusCodes.CONFLICT));
    const profile = yield member_model_1.default.create({ user: req.userId });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Your membership profile has been created.",
        data: {
            profile,
        },
    });
}));
exports.inviteMember = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validMemberId = zod_1.z.string().parse(req.params.id);
    const validData = zod_1.z
        .object({
        entity: zod_1.z.record(zod_1.z.any()),
        entityType: zod_1.z.enum(member_model_1.MEMBER_ENTITY_TYPES),
    })
        .strict()
        .parse(req.body);
    const existingMember = yield member_model_1.default.exists({
        _id: validMemberId,
        user: { $ne: req.userId },
        memberships: {
            $elemMatch: {
                entity: validData.entity,
                entityType: validData.entityType,
            },
        },
    });
    if (existingMember)
        return next(new app_error_1.default("This member has already been invited here", http_status_codes_1.StatusCodes.CONFLICT));
    const memberToInvite = yield member_model_1.default.findOne({
        _id: validMemberId,
        user: { $ne: req.userId },
        memberships: {
            $not: {
                $elemMatch: {
                    entity: validData.entity,
                    entityType: validData.entityType,
                },
            },
        },
    });
    if (!memberToInvite)
        return next(new app_error_1.default("No member found with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
    const result = yield member_model_1.default.findByIdAndUpdate(memberToInvite._id, {
        $push: {
            memberships: {
                invited: true,
                entity: validData.entity,
                entityType: validData.entityType,
            },
        },
    }).populate("user", "name email avatar online lastOnline");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `Invitation request has been sent to ${(result === null || result === void 0 ? void 0 : result.user).email}`,
    });
}));
exports.inviteMembers = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z
        .object({
        entity: zod_1.z.string(),
        entityType: zod_1.z.enum(member_model_1.MEMBER_ENTITY_TYPES),
        members: zod_1.z.array(zod_1.z.string()).min(1, "At least one member required"),
    })
        .strict()
        .parse(req.body);
    const membersToUpdate = yield member_model_1.default.find({
        _id: { $in: validData.members },
        user: { $ne: req.userId },
        memberships: {
            $not: {
                $elemMatch: {
                    entity: validData.entity,
                    entityType: validData.entityType,
                },
            },
        },
    });
    if (membersToUpdate.length === 0) {
        return next(new app_error_1.default("All selected users are already invited, rejected, or approved this invitation.", http_status_codes_1.StatusCodes.CONFLICT));
    }
    const memberIds = membersToUpdate.map((member) => member._id);
    const result = yield member_model_1.default.updateMany({ _id: { $in: memberIds } }, {
        $push: {
            memberships: {
                invited: true,
                entity: validData.entity,
                entityType: validData.entityType,
            },
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `Invitation request has been sent to ${result.modifiedCount} user(s)`,
    });
}));
exports.requestToJoinAsMember = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z
        .object({
        entity: zod_1.z.string(),
        entityType: zod_1.z.enum(member_model_1.MEMBER_ENTITY_TYPES),
    })
        .strict()
        .parse(req.body);
    if (validData.entityType === "project") {
        const projects = yield project_model_1.default.find({
            user: req.userId,
        });
        const projectIds = projects.map((project) => { var _a; return (_a = project._id) === null || _a === void 0 ? void 0 : _a.toString(); });
        if (projectIds.includes(validData.entity))
            return next(new app_error_1.default("You cannot join to a project you own.", http_status_codes_1.StatusCodes.CONFLICT));
    }
    const existingMembership = yield member_model_1.default.findOne({
        user: req.userId,
        memberships: {
            $elemMatch: {
                entity: validData.entity,
                entityType: validData.entityType,
            },
        },
    });
    if (existingMembership) {
        return next(new app_error_1.default("You have already requested to join this entity.", http_status_codes_1.StatusCodes.CONFLICT));
    }
    const result = yield member_model_1.default.findOneAndUpdate({ user: req.userId }, {
        $push: {
            memberships: {
                entity: validData.entity,
                entityType: validData.entityType,
                status: "pending",
                invited: false,
            },
        },
    }, { new: true, upsert: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `Invitation request has been sent.`,
        data: {
            memberships: result,
        },
    });
}));
exports.approveMembershipInvitation = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validEntityId = zod_1.z.string().parse(req.params.id);
    const memberships = yield member_model_1.default.findOneAndUpdate({
        user: req.userId,
        "memberships.entity": validEntityId,
        "memberships.status": "pending",
        "memberships.invited": true,
    }, { $set: { "memberships.$.status": "approved" } }, { new: true });
    if (!memberships)
        return next(new app_error_1.default("No membership found with this entity", http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `You are now a member to an entity`,
        data: {
            memberships,
        },
    });
}));
exports.rejectMembershipInvitation = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validEntityId = zod_1.z.string().parse(req.params.id);
    const memberships = yield member_model_1.default.findOneAndUpdate({
        user: req.userId,
        "memberships.entity": validEntityId,
        "memberships.status": "pending",
        "memberships.invited": true,
    }, { $set: { "memberships.$.status": "rejected" } }, { new: true });
    if (!memberships)
        return next(new app_error_1.default("No membership found with this entity", http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `You rejected to be member of this entity`,
        data: {
            memberships,
        },
    });
}));
