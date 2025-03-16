"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const task_tag_controller_1 = require("../controller/task-tag.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_middleware_1.authenticate, task_tag_controller_1.getTaskTags)
    .post(auth_middleware_1.authenticate, task_tag_controller_1.createTaskTag);
router
    .route("/:id")
    .patch(auth_middleware_1.authenticate, task_tag_controller_1.updateTaskTag)
    .delete(auth_middleware_1.authenticate, task_tag_controller_1.deleteTaskTag);
exports.default = router;
