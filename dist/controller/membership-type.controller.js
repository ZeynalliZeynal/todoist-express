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
exports.updateMembershipType = exports.deleteMembershipType = exports.createMembershipType = exports.getMembershipType = exports.getMembershipTypes = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const membership_type_model_1 = __importDefault(require("../model/membership-type.model"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../utils/app-error"));
exports.getMembershipTypes = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const memberships = yield membership_type_model_1.default.find();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Membership types fetched successfully",
        data: {
            memberships,
        },
    });
}));
exports.getMembershipType = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(req.params.id);
    const membership = yield membership_type_model_1.default.findById(validId);
    if (!membership)
        return next(new app_error_1.default("There is no membership type with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Membership type fetched successfully",
        data: {
            membership,
        },
    });
}));
exports.createMembershipType = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z
        .object({
        name: zod_1.z.string().trim(),
        label: zod_1.z.string().trim(),
        description: zod_1.z.string().trim().optional(),
    })
        .parse(req.body);
    const membership = yield membership_type_model_1.default.create({
        name: validData.name,
        description: validData.description,
        label: validData.label,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Membership type created successfully",
        data: {
            membership,
        },
    });
}));
exports.deleteMembershipType = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(req.params.id);
    yield membership_type_model_1.default.findByIdAndDelete(validId);
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Membership type deleted successfully",
    });
}));
exports.updateMembershipType = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(req.params.id);
    const membership = yield membership_type_model_1.default.findByIdAndUpdate(validId, {
        name: req.body.name,
        description: req.body.description,
        label: req.body.label,
    }, { new: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Membership type updated successfully",
        data: {
            membership,
        },
    });
}));
