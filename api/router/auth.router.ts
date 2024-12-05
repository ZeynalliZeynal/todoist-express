import express from "express";
import {
  forgotPassword,
  login,
  logout,
  refreshToken,
  resetPassword,
  signup,
  updatePassword,
  verifyEmailController,
} from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/email/verify/:token", verifyEmailController);
router.post("/password/forgot", forgotPassword);
router.patch("/password/reset/:token", resetPassword);
router.patch("/password/update", authenticate, updatePassword);

export default router;
