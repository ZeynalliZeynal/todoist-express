import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  approveMembershipInvitation,
  createMembershipProfile,
  getMember,
  getMembers,
  getMembershipsProfile,
  inviteMember,
  inviteMembers,
  rejectMembershipInvitation,
  requestToJoinAsMember,
} from "../controller/member.controller";

const router = express.Router();

router.route("/").get(authenticate, getMembers);

router.route("/profile").get(authenticate, getMembershipsProfile);

router.route("/:email").get(authenticate, getMember);

router.route("/invite").post(authenticate, inviteMembers);
router.route("/:id/invite").post(authenticate, inviteMember);
router.route("/request").post(authenticate, requestToJoinAsMember);

router.route("/create").post(authenticate, createMembershipProfile);

router.route("/:id/approve").post(authenticate, approveMembershipInvitation);
router.route("/:id/reject").post(authenticate, rejectMembershipInvitation);

export default router;
