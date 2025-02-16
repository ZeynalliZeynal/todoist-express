import express from "express";
import { deleteTask } from "../controller/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  createProject,
  getProject,
  getProjects,
} from "../controller/project.controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getProjects)
  .post(authenticate, createProject);

router
  .route("/:id")
  .get(authenticate, getProject)
  .delete(authenticate, deleteTask);

export default router;
