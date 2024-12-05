import express from "express";
import { getUser } from "../controller/profile.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getUser);
// router.get("/update", authenticate, updateProfile);

export default router;
