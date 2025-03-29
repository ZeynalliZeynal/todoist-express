"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_settings_controller_1 = require("../controller/notification-settings.controller");
const router = express_1.default.Router();
router.route("/").get(auth_middleware_1.authenticate, notification_settings_controller_1.getNotificationSettings);
router.route("/:id/enable").post(auth_middleware_1.authenticate, notification_settings_controller_1.enableNotification);
router.route("/:id/disable").post(auth_middleware_1.authenticate, notification_settings_controller_1.disableNotification);
exports.default = router;
