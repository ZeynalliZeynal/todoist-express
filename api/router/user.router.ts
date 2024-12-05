import express from "express";
import { getAllUsers, getUser } from "../controller/user.controller";
import { authorizeTo } from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, authorizeTo(["admin"]), getAllUsers);

router.get("/:id", authenticate, authorizeTo(["admin"]), getUser);

export default router;
