"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const member_controller_1 = require("../controller/member.controller");
const router = express_1.default.Router();
router.route("/profile").get(auth_middleware_1.authenticate, member_controller_1.getMemberProfile);
router.route("/").get(auth_middleware_1.authenticate, member_controller_1.getMembers);
router.route("/:id/register").post(auth_middleware_1.authenticate, member_controller_1.registerAsMemberTo);
router.route("/:id/unregister").post(auth_middleware_1.authenticate, member_controller_1.unregisterAsMemberFrom);
router.route("/:id/activate").post(auth_middleware_1.authenticate, member_controller_1.activateMembership);
router.route("/:id/deactivate").post(auth_middleware_1.authenticate, member_controller_1.deactivateMembership);
exports.default = router;
