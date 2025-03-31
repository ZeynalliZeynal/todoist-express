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
exports.deletePermissionService = exports.createPermissionService = void 0;
const permission_model_1 = __importDefault(require("../model/permission.model"));
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const project_member_model_1 = __importDefault(require("../model/project-member.model"));
const createPermissionService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z
        .object({
        name: zod_1.z.string().trim(),
        label: zod_1.z.string().trim(),
        description: zod_1.z.string().trim().optional(),
    })
        .strict()
        .parse(data);
    const existingPermission = yield permission_model_1.default.exists({
        name: validData.name,
    });
    if (existingPermission)
        throw new app_error_1.default(`Permission already exists with the name ${validData.name}`, http_status_codes_1.StatusCodes.CONFLICT);
    const newPermission = yield permission_model_1.default.create({
        name: validData.name,
        description: validData.description,
        label: validData.label,
    });
    return newPermission;
});
exports.createPermissionService = createPermissionService;
const deletePermissionService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z.string().parse(id);
    const deletedPermission = yield permission_model_1.default.findByIdAndDelete(id);
    if (!deletedPermission)
        throw new app_error_1.default(`Not found permission with id ${validData}`, http_status_codes_1.StatusCodes.NOT_FOUND);
    yield project_member_model_1.default.updateMany({ permissions: validData }, { $pull: { permissions: validData } });
});
exports.deletePermissionService = deletePermissionService;
