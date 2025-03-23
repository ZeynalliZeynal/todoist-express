import express from "express";
import {
  login,
  logout,
  refreshToken,
  sendLoginVerifyEmailController,
  sendSignupVerifyEmailController,
  signup,
} from "../controller/auth.controller";
import { getUserAgent } from "../middleware/user-agent.middleware";

const router = express.Router();

router.post("/signup", getUserAgent, signup);
router.post(
  "/signup/email/send",
  getUserAgent,
  sendSignupVerifyEmailController,
);

router.post("/login", getUserAgent, login);
router.post("/login/email/send", sendLoginVerifyEmailController);

router.post("/logout", logout);

router.post("/refresh", refreshToken);
// router.post("/email/verify", verifyEmailController);
/*
router.post("/password/forgot", forgotPassword);
router.patch("/password/reset/:token", resetPassword);
router.patch("/password/update", authenticate, updatePassword);
*/
export default router;
