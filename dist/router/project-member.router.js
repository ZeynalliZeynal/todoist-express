"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const project_member_controller_1 = require("../controller/project-member.controller");
const router = express_1.default.Router();
router.route("/:id").get(auth_middleware_1.authenticate, project_member_controller_1.getProjectMembers);
router.route("/:id/approve").get(auth_middleware_1.authenticate, project_member_controller_1.approveProjectMemberRequest);
router.route("/:id/reject").get(auth_middleware_1.authenticate, project_member_controller_1.rejectProjectMemberRequest);
exports.default = router;
