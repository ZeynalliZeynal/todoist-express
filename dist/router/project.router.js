"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controller/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const project_controller_1 = require("../controller/project.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_middleware_1.authenticate, project_controller_1.getProjects)
    .post(auth_middleware_1.authenticate, project_controller_1.createProject);
router
    .route("/:id")
    .get(auth_middleware_1.authenticate, project_controller_1.getProject)
    .delete(auth_middleware_1.authenticate, task_controller_1.deleteTask);
exports.default = router;
