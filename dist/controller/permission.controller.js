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
exports.deletePermission = exports.createPermission = exports.getPermission = exports.getPermissions = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const permission_model_1 = __importDefault(require("../model/permission.model"));
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = __importDefault(require("../utils/app-error"));
const permission_service_1 = require("../service/permission.service");
exports.getPermissions = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = yield permission_model_1.default.find();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Permissions fetched successfully",
        data: {
            permissions,
        },
    });
}));
exports.getPermission = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = yield permission_model_1.default.findById(req.params.id);
    if (!permission)
        return next(new app_error_1.default(`Not found permission found with id ${req.params.id}`, http_status_codes_1.StatusCodes.NOT_FOUND));
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Permission fetched successfully",
        data: {
            permission,
        },
    });
}));
exports.createPermission = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = yield (0, permission_service_1.createPermissionService)(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Permission created successfully",
        data: {
            permission,
        },
    });
}));
exports.deletePermission = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, permission_service_1.deletePermissionService)(req.params.id);
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Permission deleted successfully",
    });
}));
