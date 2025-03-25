"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_controller_1 = require("../controller/notification.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_middleware_1.authenticate, notification_controller_1.getNotifications)
    .post(auth_middleware_1.authenticate, notification_controller_1.createNotification)
    .delete(auth_middleware_1.authenticate, notification_controller_1.clearNotifications);
router
    .route("/:id")
    .get(auth_middleware_1.authenticate, notification_controller_1.getNotification)
    .delete(auth_middleware_1.authenticate, notification_controller_1.deleteNotification);
router.route("/:id/archive").post(auth_middleware_1.authenticate, notification_controller_1.archiveNotification);
router.route("/archive").post(auth_middleware_1.authenticate, notification_controller_1.archiveAllNotifications);
router.route("/:id/unarchive").post(auth_middleware_1.authenticate, notification_controller_1.unarchiveNotification);
router.route("/unarchive").post(auth_middleware_1.authenticate, notification_controller_1.unarchiveAllNotifications);
router.route("/:id/read").post(auth_middleware_1.authenticate, notification_controller_1.readNotification);
router.route("/read").post(auth_middleware_1.authenticate, notification_controller_1.readAllNotifications);
router.route("/:id/unread").post(auth_middleware_1.authenticate, notification_controller_1.unreadNotification);
router.route("/unread").post(auth_middleware_1.authenticate, notification_controller_1.unreadAllNotifications);
exports.default = router;
