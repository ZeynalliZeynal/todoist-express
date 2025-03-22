import express from "express";
import {
  addTaskToCompleted,
  clearTasks,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  removeTaskFromCompleted,
  updateTask,
} from "../controller/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getTasks)
  .post(authenticate, createTask)
  .delete(authenticate, clearTasks);

router
  .route("/:id")
  .get(authenticate, getTask)
  .patch(authenticate, updateTask)
  .delete(authenticate, deleteTask);

router
  .route("/:id/completed")
  .post(authenticate, addTaskToCompleted)
  .delete(authenticate, removeTaskFromCompleted);

export default router;
