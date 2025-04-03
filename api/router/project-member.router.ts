import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  approveProjectMemberRequest,
  getProjectMembers,
  rejectProjectMemberRequest,
} from "../controller/project-member.controller";

const router = express.Router();

router.route("/:id").get(authenticate, getProjectMembers);
router.route("/:id/approve").get(authenticate, approveProjectMemberRequest);
router.route("/:id/reject").get(authenticate, rejectProjectMemberRequest);

export default router;
