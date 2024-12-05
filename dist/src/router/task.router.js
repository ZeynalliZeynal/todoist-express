"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controller/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.param("id", (req, res, next, value, name) => {
    console.log(value);
    next();
});
router
    .route("/")
    .get(auth_middleware_1.authenticate, task_controller_1.getTasks)
    .post(auth_middleware_1.authenticate, task_controller_1.createTask)
    .delete(auth_middleware_1.authenticate, task_controller_1.clearTasks);
router
    .route("/:id")
    .get(auth_middleware_1.authenticate, task_controller_1.getTask)
    .patch(auth_middleware_1.authenticate, task_controller_1.updateTask)
    .delete(auth_middleware_1.authenticate, task_controller_1.deleteTask);
exports.default = router;
