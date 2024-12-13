import express from "express";
import { getTemplateCategories } from "../controller/template.controller";

const router = express.Router();

router.route("/").get(getTemplateCategories);

export default router;
