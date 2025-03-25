import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  archiveAllNotifications,
  archiveNotification,
  clearNotifications,
  createNotification,
  deleteNotification,
  getNotification,
  getNotifications,
  readAllNotifications,
  readNotification,
  unarchiveAllNotifications,
  unarchiveNotification,
  unreadAllNotifications,
  unreadNotification,
} from "../controller/notification.controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getNotifications)
  .post(authenticate, createNotification)
  .delete(authenticate, clearNotifications);

router
  .route("/:id")
  .get(authenticate, getNotification)
  .delete(authenticate, deleteNotification);

router.route("/:id/archive").post(authenticate, archiveNotification);
router.route("/archive").post(authenticate, archiveAllNotifications);
router.route("/:id/unarchive").post(authenticate, unarchiveNotification);
router.route("/unarchive").post(authenticate, unarchiveAllNotifications);

router.route("/:id/read").post(authenticate, readNotification);
router.route("/read").post(authenticate, readAllNotifications);
router.route("/:id/unread").post(authenticate, unreadNotification);
router.route("/unread").post(authenticate, unreadAllNotifications);

export default router;
