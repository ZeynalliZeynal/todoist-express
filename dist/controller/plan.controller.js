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
exports.createPlanFeature = exports.getPlanFeatures = exports.createPlan = exports.getPlans = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const plan_model_1 = __importDefault(require("../model/plan.model"));
const http_status_codes_1 = require("http-status-codes");
const plan_features_model_1 = __importDefault(require("../model/plan-features.model"));
exports.getPlans = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const plans = yield plan_model_1.default.find().populate("allFeatures");
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: { plans },
    });
}));
exports.createPlan = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, features } = req.body;
    const plan = yield plan_model_1.default.create({
        name,
        description,
        price,
        features,
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            plan,
        },
    });
}));
exports.getPlanFeatures = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const features = yield plan_features_model_1.default.find().populate("allPlans");
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: { features },
    });
}));
exports.createPlanFeature = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, title, plans } = req.body;
    const feature = yield plan_features_model_1.default.create({
        title,
        name,
        description,
        plans,
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            feature,
        },
    });
}));
