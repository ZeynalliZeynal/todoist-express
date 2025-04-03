import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  approveMembershipInvitation,
  getMember,
  getMembers,
  getMemberships,
  inviteMembers,
  rejectMembershipInvitation,
  requestToJoinAsMember,
} from "../controller/member.controller";

const router = express.Router();

router.route("/").get(authenticate, getMembers);

router.route("/memberships").get(authenticate, getMemberships);

router.route("/:email").get(authenticate, getMember);

router.route("/invite").post(authenticate, inviteMembers);
router.route("/request").post(authenticate, requestToJoinAsMember);

router.route("/:id/approve").post(authenticate, approveMembershipInvitation);
router.route("/:id/reject").post(authenticate, rejectMembershipInvitation);

export default router;
