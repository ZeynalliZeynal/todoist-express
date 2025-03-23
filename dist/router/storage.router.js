"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const storage_controller_1 = require("../controller/storage.controller");
const storage_middleware_1 = require("../middleware/storage.middleware");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.post("/:prefix/upload", auth_middleware_1.authenticate, storage_middleware_1.checkBucketPrefix, upload.single("file"), storage_controller_1.uploadFile);
router.delete("/:prefix/:filename", auth_middleware_1.authenticate, storage_middleware_1.checkBucketPrefix, storage_controller_1.deleteFile);
exports.default = router;
