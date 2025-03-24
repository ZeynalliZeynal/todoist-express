import { getUserAgent } from "./../middleware/user-agent.middleware";
import express from "express";
import { getProfile, updateProfile } from "../controller/profile.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getUserAgent, getProfile);
router.patch("/update", authenticate, updateProfile);

export default router;
