import express from "express";
import {
  login,
  logout,
  refreshToken,
  resendVerifyEmailController,
  signup,
  verifyEmailController,
} from "../controller/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/email/verify", verifyEmailController);
router.post("/email/verify/resend", resendVerifyEmailController);
/*
router.post("/password/forgot", forgotPassword);
router.patch("/password/reset/:token", resetPassword);
router.patch("/password/update", authenticate, updatePassword);
*/
export default router;
