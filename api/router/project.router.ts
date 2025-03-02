import express from "express";
import {
  addProjectToFavorites,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  removeProjectFromFavorites,
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

router
  .route("/:id/favorites")
  .delete(authenticate, removeProjectFromFavorites)
  .post(authenticate, addProjectToFavorites);

export default router;
