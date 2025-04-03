import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMember,
  getMembers,
  inviteMember,
} from "../controller/member.controller";
const router = express.Router();

router.route("/").get(authenticate, getMembers);

router.route("/:email").get(authenticate, getMember);

router.route("/:id/invite").post(authenticate, inviteMember);

export default router;
