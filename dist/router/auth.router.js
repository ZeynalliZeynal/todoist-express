"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const router = express_1.default.Router();
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.post("/refresh", auth_controller_1.refreshToken);
router.post("/email/verify", auth_controller_1.verifyEmailController);
router.post("/email/verify/resend", auth_controller_1.resendVerifyEmailController);
/*
router.post("/password/forgot", forgotPassword);
router.patch("/password/reset/:token", resetPassword);
router.patch("/password/update", authenticate, updatePassword);
*/
exports.default = router;
