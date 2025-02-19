import express from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../controller/project.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getProjects)
  .post(authenticate, createProject);

router
  .route("/:id")
  .get(authenticate, getProject)
  .delete(authenticate, deleteProject)
  .patch(authenticate, updateProject);

export default router;
