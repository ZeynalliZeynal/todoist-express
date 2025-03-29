import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  disableNotification,
  enableNotification,
  getAllNotificationSettings,
} from "../controller/notification-settings.controller";
const router = express.Router();

router.route("/").get(authenticate, getAllNotificationSettings);

router.route("/:id/enable").post(authenticate, enableNotification);
router.route("/:id/disable").post(authenticate, disableNotification);

export default router;
