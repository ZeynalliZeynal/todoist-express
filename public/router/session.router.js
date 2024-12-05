"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_controller_1 = require("../controller/session.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authenticate, session_controller_1.getSessions);
router.delete("/:id", auth_middleware_1.authenticate, session_controller_1.deleteSession);
exports.default = router;
