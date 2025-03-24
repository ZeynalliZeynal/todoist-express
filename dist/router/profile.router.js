"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_agent_middleware_1 = require("./../middleware/user-agent.middleware");
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("../controller/profile.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authenticate, user_agent_middleware_1.getUserAgent, profile_controller_1.getProfile);
router.patch("/update", auth_middleware_1.authenticate, profile_controller_1.updateProfile);
exports.default = router;
