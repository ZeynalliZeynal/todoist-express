"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const template_controller_1 = require("../controller/template.controller");
const auth_controller_1 = require("../controller/auth.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(template_controller_1.getTemplates)
    .post((0, auth_controller_1.authorizeTo)(["admin"]), template_controller_1.createTemplate);
router.route("/:id").get(template_controller_1.getTemplate);
exports.default = router;
