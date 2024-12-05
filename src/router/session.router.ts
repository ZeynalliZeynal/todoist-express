import express from "express";
import { deleteSession, getSessions } from "../controller/session.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getSessions);
router.delete("/:id", authenticate, deleteSession);
export default router;
