import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getFeedbacks, sendFeedback } from "../controller/feedback.controller";
import { authorizeTo } from "../controller/auth.controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getFeedbacks)
  .post(authenticate, sendFeedback);

export default router;
