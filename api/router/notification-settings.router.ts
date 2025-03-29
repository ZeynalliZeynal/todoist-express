import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  disableNotification,
  enableNotification,
  getNotificationSettings,
} from "../controller/notification-settings.controller";
const router = express.Router();

router.route("/").get(authenticate, getNotificationSettings);

router.route("/:id/enable").post(authenticate, enableNotification);
router.route("/:id/disable").post(authenticate, disableNotification);

export default router;
