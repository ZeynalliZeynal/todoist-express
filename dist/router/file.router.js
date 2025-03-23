"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const file_controller_1 = require("../controller/file.controller");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
router.post("/upload", auth_middleware_1.authenticate, upload.single("file"), file_controller_1.uploadFile);
router.delete("/:filename", auth_middleware_1.authenticate, file_controller_1.deleteFile);
exports.default = router;
