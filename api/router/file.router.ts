import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import multer from "multer";
import { uploadFile } from "../controller/file.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), uploadFile);

export default router;
