"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const feedback_controller_1 = require("../controller/feedback.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_middleware_1.authenticate, feedback_controller_1.getFeedbacks)
    .post(auth_middleware_1.authenticate, feedback_controller_1.sendFeedback);
exports.default = router;
