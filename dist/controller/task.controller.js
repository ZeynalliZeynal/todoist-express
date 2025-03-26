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
exports.removeTaskFromCompleted = exports.addTaskToCompleted = exports.deleteTask = exports.getTask = exports.getTasks = exports.clearTasks = exports.updateTask = exports.createTask = void 0;
const api_features_1 = __importDefault(require("../utils/api-features"));
const task_model_1 = __importDefault(require("../model/task.model"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const project_model_1 = __importDefault(require("../model/project.model"));
const slugify_1 = __importDefault(require("slugify"));
const notification_service_1 = require("../service/notification.service");
const notification_constant_1 = require("../constants/notification.constant");
const notification_model_1 = require("../model/notification.model");
const zod_1 = require("zod");
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
        slug: (0, slugify_1.default)(req.body.name, { lower: true }),
        project: req.body.project,
    });
    if (existingTask)
        return next(new app_error_1.default(`Task with the name '${req.body.name}' already exists. Try another project or change the name.`, http_status_codes_1.StatusCodes.CONFLICT));
    const task = yield task_model_1.default.create({
        name: req.body.name,
        description: req.body.description,
        tags: req.body.tags,
        dueDate: req.body.dueDate || undefined,
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
    const task = yield task_model_1.default.findOne({
        user: req.userId,
        _id: req.params.id,
    });
    if (!task) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    // create a notification
    yield (0, notification_service_1.createNotificationService)({
        name: (0, notification_constant_1.generateNotificationName)(notification_model_1.NotificationTypeEnum.TASK_UPDATED, task.name),
        data: task,
        value: task.id,
        type: notification_model_1.NotificationTypeEnum.TASK_UPDATED,
        user: req.userId,
    });
    task.name = body.name;
    task.description = body.description;
    task.tags = body.tags;
    task.dueDate = body.dueDate || undefined;
    task.priority = body.priority;
    yield task.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Task successfully updated.",
        data: {
            task,
        },
    });
}));
exports.updateTask = updateTask;
const addTaskToCompleted = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findOneAndUpdate({ _id: req.params.id, user: req.userId }, {
        completed: true,
    }, {
        new: true,
        runValidators: false,
    });
    if (!task) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Task successfully completed.",
        data: {
            task,
        },
    });
}));
exports.addTaskToCompleted = addTaskToCompleted;
const removeTaskFromCompleted = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findOneAndUpdate({ _id: req.params.id, user: req.userId }, {
        completed: false,
    }, {
        new: true,
        runValidators: false,
    });
    if (!task) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Task successfully completed.",
        data: {
            task,
        },
    });
}));
exports.removeTaskFromCompleted = removeTaskFromCompleted;
const deleteTask = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.default.findOneAndDelete({
        user: req.userId,
        _id: req.params.id,
    });
    if (!task) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    yield (0, notification_service_1.createNotificationService)({
        name: (0, notification_constant_1.generateNotificationName)(notification_model_1.NotificationTypeEnum.TASK_DELETED, task.name),
        data: task,
        value: task.id,
        type: notification_model_1.NotificationTypeEnum.TASK_DELETED,
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success",
        message: "Task successfully deleted.",
    });
}));
exports.deleteTask = deleteTask;
const clearTasks = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validProjectId = zod_1.z.string().parse(req.body.project);
    yield task_model_1.default.deleteMany({
        user: req.userId,
        project: validProjectId,
    });
    const project = yield project_model_1.default.findById(validProjectId);
    if (!project)
        return next(new app_error_1.default(`No project found with the id ${req.body.project}`, http_status_codes_1.StatusCodes.NOT_FOUND));
    yield (0, notification_service_1.createNotificationService)({
        name: `Tasks have been cleared from p`,
        data: project,
        value: project.id,
        type: notification_model_1.NotificationTypeEnum.TASK_CLEARED,
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success",
        message: "Tasks successfully cleared.",
        data: null,
    });
}));
exports.clearTasks = clearTasks;
