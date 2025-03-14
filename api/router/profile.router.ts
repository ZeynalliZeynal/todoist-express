import express from "express";
import { getProfile, updateProfile } from "../controller/profile.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getProfile);
router.patch("/update", authenticate, updateProfile);

export default router;
