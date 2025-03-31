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
exports.deactivateMembership = exports.activateMembership = exports.unregisterAsMemberFrom = exports.registerAsMemberTo = exports.getMembers = exports.getMemberProfile = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const member_model_1 = __importDefault(require("../model/member.model"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const membership_type_model_1 = __importDefault(require("../model/membership-type.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const project_member_model_1 = __importDefault(require("../model/project-member.model"));
exports.getMemberProfile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingMember = yield member_model_1.default.exists({
        user: req.userId,
    });
    if (!existingMember)
        yield member_model_1.default.create({
            user: req.userId,
        });
    const member = yield member_model_1.default.findOne({
        user: req.userId,
    })
        .populate("user")
        .populate("memberships.membership");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Membership data fetched successfully",
        data: {
            member,
        },
    });
}));
exports.getMembers = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield member_model_1.default.find().populate("user");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Members fetched successfully",
        data: {
            members,
        },
    });
}));
exports.registerAsMemberTo = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validMembershipTypeId = zod_1.z.string().parse(req.params.id);
    const membershipType = yield membership_type_model_1.default.findById(validMembershipTypeId);
    if (!membershipType)
        return next(new app_error_1.default("There is no membership type with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
    const memberData = yield member_model_1.default.findOneAndUpdate({ user: req.userId }, { memberships: { $push: { membership: validMembershipTypeId } } });
    if (!memberData)
        return next(new app_error_1.default("Your member data does not exist.", http_status_codes_1.StatusCodes.NOT_FOUND));
    if (membershipType.name === "project")
        yield project_member_model_1.default.create({
            member: memberData.id,
        });
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `You are now open to joining to ${membershipType.name}s`,
        data: { memberData },
    });
}));
exports.unregisterAsMemberFrom = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validMembershipTypeId = zod_1.z.string().parse(req.params.id);
    const membershipType = yield membership_type_model_1.default.findById(validMembershipTypeId);
    if (!membershipType)
        return next(new app_error_1.default("There is no membership type with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
    const memberData = yield member_model_1.default.findOneAndUpdate({ user: req.userId }, { memberships: { $pull: { membership: validMembershipTypeId } } });
    if (!memberData)
        return next(new app_error_1.default("Your member data does not exist.", http_status_codes_1.StatusCodes.NOT_FOUND));
    if (membershipType.name === "project")
        yield project_member_model_1.default.findOneAndDelete({
            member: memberData.id,
        });
    if (membershipType.name === "project")
        yield project_member_model_1.default.deleteMany();
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `You are removed from all ${membershipType.name}s and you will no longer be able to join to ${membershipType.name}s unless you register again.`,
        data: { memberData },
    });
}));
exports.activateMembership = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validMembershipTypeId = zod_1.z.string().parse(req.params.id);
    const membershipType = yield membership_type_model_1.default.findById(validMembershipTypeId);
    if (!membershipType)
        return next(new app_error_1.default("There is no membership type with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
    const memberData = yield member_model_1.default.findOneAndUpdate({ user: req.userId, "memberships.membership": validMembershipTypeId }, { $set: { "memberships.$.active": true } });
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `You activated your membership to ${membershipType.name}s`,
        data: { memberData },
    });
}));
exports.deactivateMembership = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validMembershipTypeId = zod_1.z.string().parse(req.params.id);
    const membershipType = yield membership_type_model_1.default.findById(validMembershipTypeId);
    if (!membershipType)
        return next(new app_error_1.default("There is no membership type with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
    const memberData = yield member_model_1.default.findOneAndUpdate({ user: req.userId, "memberships.membership": validMembershipTypeId }, { $set: { "memberships.$.active": false } });
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: `You deactivated your membership to ${membershipType.name}s. You will no longer be able to join to further ${membershipType.name}s unless you activate it.`,
        data: { memberData },
    });
}));
