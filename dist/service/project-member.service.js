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
exports.deleteProjectMemberService = exports.createProjectMemberService = void 0;
const project_member_model_1 = __importDefault(require("../model/project-member.model"));
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const project_model_1 = __importDefault(require("../model/project.model"));
const createProjectMemberService = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z
        .object({
        role: zod_1.z.string().default("member").optional(),
        active: zod_1.z.boolean().default(true).optional(),
        status: zod_1.z.string().default("pending").optional(),
    })
        .strict()
        .parse(data);
    const existingMember = yield project_member_model_1.default.exists({
        user: user,
    });
    if (existingMember)
        throw new app_error_1.default("You are already a registered member. You can join or get invited to projects", http_status_codes_1.StatusCodes.CONFLICT);
    return yield project_member_model_1.default.create({
        user: user,
        role: validData.role,
        active: validData.active,
        status: validData.status,
    });
});
exports.createProjectMemberService = createProjectMemberService;
const deleteProjectMemberService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(id);
    const deletedMember = yield project_member_model_1.default.findByIdAndDelete(id);
    if (!deletedMember)
        throw new app_error_1.default("There is no registered member with this id", http_status_codes_1.StatusCodes.NOT_FOUND);
    yield project_model_1.default.updateMany({ "members.member": validId }, { $pull: { members: { member: validId } } });
});
exports.deleteProjectMemberService = deleteProjectMemberService;
