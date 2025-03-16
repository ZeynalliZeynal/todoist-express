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
exports.deleteTaskTag = exports.getTaskTags = exports.updateTaskTag = exports.createTaskTag = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const task_tag_model_1 = __importDefault(require("../model/task-tag.model"));
const task_model_1 = __importDefault(require("../model/task.model"));
const getTaskTags = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield task_tag_model_1.default.find({
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            tags,
        },
    });
}));
exports.getTaskTags = getTaskTags;
const createTaskTag = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTag = yield task_tag_model_1.default.exists({
        user: req.userId,
        name: req.body.name,
    });
    if (existingTag)
        return next(new app_error_1.default(`Tag with the name '${req.body.name}' already exists.`, http_status_codes_1.StatusCodes.CONFLICT));
    const tag = yield task_tag_model_1.default.create({
        name: req.body.name,
        description: req.body.description,
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success",
        message: "Tag successfully created.",
        data: {
            tag,
        },
    });
}));
exports.createTaskTag = createTaskTag;
const updateTaskTag = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const tag = yield task_tag_model_1.default.findOneAndUpdate({ _id: req.params.id, user: req.userId }, {
        name: body.name,
        description: req.body.description,
    }, {
        new: true,
        runValidators: true,
    });
    if (!tag) {
        return next(new app_error_1.default(`No tag found with the id ${req.params.id}`, 404));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Tag successfully updated.",
        data: {
            tag,
        },
    });
}));
exports.updateTaskTag = updateTaskTag;
const deleteTaskTag = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tag = yield task_tag_model_1.default.findOneAndDelete({
        user: req.userId,
        _id: req.params.id,
    });
    if (!tag) {
        return next(new app_error_1.default(`No tag found with the id ${req.params.id}`, 404));
    }
    yield task_model_1.default.updateMany({ tags: req.params.id, user: req.userId }, { $pull: { tags: req.params.id } });
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success",
        message: "Tag successfully deleted.",
        data: null,
    });
}));
exports.deleteTaskTag = deleteTaskTag;
