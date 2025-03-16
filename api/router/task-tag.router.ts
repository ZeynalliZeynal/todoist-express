import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createTaskTag,
  deleteTaskTag,
  getTaskTags,
  updateTaskTag,
} from "../controller/task-tag.controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getTaskTags)
  .post(authenticate, createTaskTag);

router
  .route("/:id")
  .patch(authenticate, updateTaskTag)
  .delete(authenticate, deleteTaskTag);

export default router;
