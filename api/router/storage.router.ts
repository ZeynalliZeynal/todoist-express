import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import multer from "multer";
import { deleteFile, uploadFile } from "../controller/storage.controller";
import { checkBucketPrefix } from "../middleware/storage.middleware";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/:prefix/upload",
  authenticate,
  checkBucketPrefix,
  upload.single("file"),
  uploadFile,
);

router.delete(
  "/:prefix/:filename",
  authenticate,
  checkBucketPrefix,
  deleteFile,
);

export default router;
