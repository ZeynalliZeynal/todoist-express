"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("../controller/project.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_middleware_1.authenticate, project_controller_1.getProjects)
    .post(auth_middleware_1.authenticate, project_controller_1.createProject);
router
    .route("/:id")
    .get(auth_middleware_1.authenticate, project_controller_1.getProject)
    .delete(auth_middleware_1.authenticate, project_controller_1.deleteProject)
    .patch(auth_middleware_1.authenticate, project_controller_1.updateProject);
exports.default = router;
