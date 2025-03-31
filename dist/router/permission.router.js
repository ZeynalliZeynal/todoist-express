"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controller/auth.controller");
const permission_controller_1 = require("../controller/permission.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_middleware_1.authenticate, (0, auth_controller_1.authorizeTo)(["admin"]), permission_controller_1.getPermissions)
    .post(auth_middleware_1.authenticate, (0, auth_controller_1.authorizeTo)(["admin"]), permission_controller_1.createPermission);
router
    .route("/:id")
    .get(auth_middleware_1.authenticate, (0, auth_controller_1.authorizeTo)(["admin"]), permission_controller_1.getPermission)
    .delete(auth_middleware_1.authenticate, (0, auth_controller_1.authorizeTo)(["admin"]), permission_controller_1.deletePermission);
exports.default = router;
