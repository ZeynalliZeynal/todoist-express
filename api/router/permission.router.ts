import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeTo } from "../controller/auth.controller";
import {
  createPermission,
  deletePermission,
  getPermission,
  getPermissions,
} from "../controller/permission.controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, authorizeTo(["admin"]), getPermissions)
  .post(authenticate, authorizeTo(["admin"]), createPermission);

router
  .route("/:id")
  .get(authenticate, authorizeTo(["admin"]), getPermission)
  .delete(authenticate, authorizeTo(["admin"]), deletePermission);

export default router;
