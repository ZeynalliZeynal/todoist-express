import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  activateMembership,
  deactivateMembership,
  getMemberProfile,
  getMembers,
  registerAsMemberTo,
  unregisterAsMemberFrom,
} from "../controller/member.controller";

const router = express.Router();

router.route("/profile").get(authenticate, getMemberProfile);

router.route("/").get(authenticate, getMembers);

router.route("/:id/register").post(authenticate, registerAsMemberTo);
router.route("/:id/unregister").post(authenticate, unregisterAsMemberFrom);

router.route("/:id/activate").post(authenticate, activateMembership);
router.route("/:id/deactivate").post(authenticate, deactivateMembership);

export default router;
