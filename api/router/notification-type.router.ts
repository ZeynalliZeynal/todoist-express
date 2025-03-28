import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeTo } from "../controller/auth.controller";
import {
  createNotificationType,
  getNotificationTypes,
} from "../controller/notification-type.controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, authorizeTo(["admin"]), getNotificationTypes)
  .post(authenticate, authorizeTo(["admin"]), createNotificationType);

export default router;
