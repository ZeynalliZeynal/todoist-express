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
exports.deleteTask = exports.getTask = exports.getTasks = exports.clearTasks = exports.updateTask = exports.createTask = void 0;
const api_features_1 = __importDefault(require("../utils/api-features"));
const task_model_1 = __importDefault(require("../model/task.model"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const project_model_1 = __importDefault(require("../model/project.model"));
const getTasks = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let features = new api_features_1.default(task_model_1.default.find({
        user: req.userId,
    }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    let query = features.query;
    if (req.query.project) {
        const project = yield project_model_1.default.findOne({
            user: req.userId,
            slug: req.query.project,
        });
        if (!project) {
            return next(new app_error_1.default(`No project found with the slug ${req.query.project}`, 404));
        }
        query = query.find({ project: project._id });
    }
    const tasks = yield query
        .populate("user")
        .populate("project")
        .populate("tags");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            tasks,
        },
    });
}));
exports.getTasks = getTasks;
const getTask = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findOne({
        user: req.userId,
        _id: req.params.id,
    })
        .populate("user")
        .populate("project");
    if (!task) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    res.status(302).json({
        status: "success",
        data: {
            task,
        },
    });
}));
exports.getTask = getTask;
const createTask = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.project)
        return next(new app_error_1.default("A task must be belong to a project.", http_status_codes_1.StatusCodes.BAD_REQUEST));
    const project = yield project_model_1.default.exists({
        user: req.userId,
        _id: req.body.project,
    });
    if (!project)
        return next(new app_error_1.default(`Project with id ${req.body.project} not found.`, 404));
    const existingTask = yield task_model_1.default.exists({
        user: req.userId,
        name: req.body.name,
        project: req.body.project,
    });
    if (existingTask)
        return next(new app_error_1.default(`Task with the name '${req.body.name}' already exists. Try another project or change the name.`, http_status_codes_1.StatusCodes.CONFLICT));
    const task = yield task_model_1.default.create({
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        project: req.body.project,
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success",
        message: "Task successfully added.",
        data: {
            task,
        },
    });
}));
exports.createTask = createTask;
const updateTask = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const task = yield task_model_1.default.findOneAndUpdate({ _id: req.params.id, user: req.userId }, Object.assign(Object.assign({}, body), { updatedAt: Date.now() }), {
        new: true,
        runValidators: true,
    });
    if (!task) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Task successfully updated.",
        data: {
            task,
        },
    });
}));
exports.updateTask = updateTask;
const deleteTask = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findOneAndDelete({
        user: req.userId,
        _id: req.params.id,
    });
    if (!task) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success",
        message: "Task successfully deleted.",
        data: null,
    });
}));
exports.deleteTask = deleteTask;
const clearTasks = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield task_model_1.default.deleteMany({
        user: req.userId,
        project: req.body.project,
    });
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success",
        message: "Tasks successfully cleared.",
        data: null,
    });
}));
exports.clearTasks = clearTasks;
