import express from "express";
import {
  createTemplate,
  getTemplate,
  getTemplates,
} from "../controller/template.controller";
import { authorizeTo } from "../controller/auth.controller";

const router = express.Router();

router
  .route("/")
  .get(getTemplates)
  .post(authorizeTo(["admin"]), createTemplate);

router.route("/:id").get(getTemplate);

export default router;
