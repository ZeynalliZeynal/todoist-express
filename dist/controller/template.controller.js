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
exports.getTemplateCategories = exports.createTemplate = exports.getTemplate = exports.getTemplates = void 0;
const template_model_1 = __importDefault(require("../model/template.model"));
const api_features_1 = __importDefault(require("../utils/api-features"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const template_category_model_1 = __importDefault(require("../model/template-category.model"));
const http_status_codes_1 = require("http-status-codes");
const getTemplates = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = template_model_1.default.find();
    if (req.query.category && req.query.category === "enable")
        query = query.populate("category");
    if (req.query.user && req.query.user === "enable")
        query = query.populate("user");
    const features = new api_features_1.default(query, req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const templates = yield features.query;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            templates,
        },
    });
}));
exports.getTemplates = getTemplates;
const getTemplate = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const template = yield template_model_1.default.findById(req.params.id);
    if (!template) {
        return next(new app_error_1.default(`No task found with the id ${req.params.id}`, 404));
    }
    res.status(302).json({
        status: "success",
        data: {
            template,
        },
    });
}));
exports.getTemplate = getTemplate;
const createTemplate = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield template_category_model_1.default.findOne({
        name: {
            $regex: req.body.category,
            $options: "i",
        },
    });
    if (!category)
        return next(new app_error_1.default("No category found with this name. Please recheck for typos.", http_status_codes_1.StatusCodes.NOT_FOUND));
    const template = yield template_model_1.default.create({
        name: req.body.name,
        description: req.body.description,
        content: req.body.content,
        exampleUrl: req.body.exampleUrl,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        category: category._id,
        user: req.userId,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success",
        data: {
            template,
        },
    });
}));
exports.createTemplate = createTemplate;
const getTemplateCategories = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = template_category_model_1.default.find();
    if (req.query.templates && req.query.templates === "enable")
        query = query.populate("templates");
    const categories = yield query;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            categories,
        },
    });
}));
exports.getTemplateCategories = getTemplateCategories;
