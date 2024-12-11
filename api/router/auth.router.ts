import express from "express";
import {
  login,
  logout,
  refreshToken,
  sendLoginVerifyEmailController,
  sendSignupVerifyEmailController,
  signup,
} from "../controller/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/signup/email/send", sendSignupVerifyEmailController);

router.post("/login", login);
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
