"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plan_controller_1 = require("../controller/plan.controller");
const router = express_1.default.Router();
router.route("/").get(plan_controller_1.getPlans).post(plan_controller_1.createPlan);
router.route("/features").get(plan_controller_1.getPlanFeatures).post(plan_controller_1.createPlanFeature);
exports.default = router;
