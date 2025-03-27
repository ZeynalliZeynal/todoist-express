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
exports.removeProjectFromFavorites = exports.addProjectToFavorites = exports.deleteProject = exports.createProject = exports.updateProject = exports.getProject = exports.getProjects = void 0;
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
const getProjects = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const features = new api_features_1.default(project_model_1.default.find({
        user: req.userId,
    }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    let query = features.query;
    if (req.query.slug)
        query = query.find({ slug: req.query.slug });
    const projects = yield query.populate("user").populate("tasks");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            projects,
        },
    });
}));
exports.getProjects = getProjects;
const getProject = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findOne({
        user: req.userId,
        _id: req.params.id,
    }).populate("user");
    if (!project) {
        return next(new app_error_1.default(`No project found with the id ${req.params.id}`, 404));
    }
    res.status(302).json({
        status: "success",
        data: {
            project,
        },
    });
}));
exports.getProject = getProject;
const createProject = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existedProject = yield project_model_1.default.exists({
        user: req.userId,
        slug: (0, slugify_1.default)(req.body.name, { lower: true }),
    });
    if (existedProject)
        return next(new app_error_1.default(`Project with the name '${req.body.name}' already exists.`, http_status_codes_1.StatusCodes.CONFLICT));
    const project = yield project_model_1.default.create({
        name: req.body.name,
        description: req.body.description,
        logo: req.body.logo,
        user: req.userId,
    });
    res.status(201).json({
        status: "success",
        message: "Project successfully created.",
        data: {
            project,
        },
    });
}));
exports.createProject = createProject;
const deleteProject = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield task_model_1.default.deleteMany({
        user: req.userId,
        project: req.params.id,
    });
    const project = yield project_model_1.default.findOneAndDelete({
        user: req.userId,
        _id: req.params.id,
    });
    if (!project) {
        return next(new app_error_1.default(`No project found with the id ${req.params.id}`, 404));
    }
    yield (0, notification_service_1.createNotificationService)({
        name: (0, notification_constant_1.generateNotificationName)(notification_model_1.NotificationTypeEnum.PROJECT_DELETED, project.name),
        data: project.toObject(),
        value: project.id,
        type: notification_model_1.NotificationTypeEnum.PROJECT_DELETED,
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success",
        message: "Project successfully deleted.",
        data: null,
    });
}));
exports.deleteProject = deleteProject;
const updateProject = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findOne({
        user: req.userId,
        _id: req.params.id,
    });
    if (!project) {
        return next(new app_error_1.default(`No project found with the id ${req.params.id}`, http_status_codes_1.StatusCodes.NOT_FOUND));
    }
    project.name = req.body.name;
    project.description = req.body.description;
    project.logo = req.body.logo;
    const existedProject = yield project_model_1.default.exists({
        user: req.userId,
        slug: (0, slugify_1.default)(project.name, { lower: true }),
        _id: { $ne: project._id },
    });
    if (existedProject)
        return next(new app_error_1.default(`Project with the name '${req.body.name}' already exists.`, http_status_codes_1.StatusCodes.CONFLICT));
    yield (0, notification_service_1.createNotificationService)({
        name: (0, notification_constant_1.generateNotificationName)(notification_model_1.NotificationTypeEnum.PROJECT_UPDATED, project.name),
        data: project.toObject(),
        value: project.id,
        type: notification_model_1.NotificationTypeEnum.PROJECT_UPDATED,
        user: req.userId,
    });
    yield project.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Project successfully updated.",
        data: { project },
    });
}));
exports.updateProject = updateProject;
const addProjectToFavorites = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingProject = yield project_model_1.default.exists({
        user: req.userId,
        _id: req.params.id,
    });
    if (!existingProject) {
        return next(new app_error_1.default(`No project found with the id ${req.params.id}`, 404));
    }
    const project = yield project_model_1.default.findOneAndUpdate({
        user: req.userId,
        _id: req.params.id,
    }, {
        favorite: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Project successfully added to favorites.",
        data: { project },
    });
}));
exports.addProjectToFavorites = addProjectToFavorites;
const removeProjectFromFavorites = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingProject = yield project_model_1.default.exists({
        user: req.userId,
        _id: req.params.id,
    });
    if (!existingProject) {
        return next(new app_error_1.default(`No project found with the id ${req.params.id}`, 404));
    }
    yield project_model_1.default.findOneAndUpdate({
        user: req.userId,
        _id: req.params.id,
    }, {
        favorite: false,
    });
    res.status(204).json({
        status: "success",
        message: "Project successfully removed from favorites",
    });
}));
exports.removeProjectFromFavorites = removeProjectFromFavorites;
