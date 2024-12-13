import express from "express";
import {
  createTemplate,
  getTemplate,
  getTemplates,
} from "../controller/template.controller";
import { authorizeTo } from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(getTemplates)
  .post(authenticate, authorizeTo(["admin"]), createTemplate);

router.route("/:id").get(getTemplate);

export default router;
