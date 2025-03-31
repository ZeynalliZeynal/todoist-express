import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorizeTo } from "../controller/auth.controller";
import {
  createMembershipType,
  deleteMembershipType,
  getMembershipType,
  getMembershipTypes,
  updateMembershipType,
} from "../controller/membership-type.controller";

const router = express.Router();

router
  .route("/")
  .get(authenticate, getMembershipTypes)
  .post(authenticate, authorizeTo(["admin"]), createMembershipType);

router
  .route("/:id")
  .get(authenticate, getMembershipType)
  .patch(authenticate, authorizeTo(["admin"]), updateMembershipType)
  .delete(authenticate, authorizeTo(["admin"]), deleteMembershipType);

export default router;
