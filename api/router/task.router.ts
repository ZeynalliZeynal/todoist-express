import express from "express";
import {
  clearTasks,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controller/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.param("id", (req, res, next, value, name) => {
  console.log(value);
  next();
});

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

export default router;
