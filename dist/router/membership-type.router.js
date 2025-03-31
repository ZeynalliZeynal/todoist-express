"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controller/auth.controller");
const membership_type_controller_1 = require("../controller/membership-type.controller");
const router = express_1.default.Router();
router
    .route("/")
    .get(auth_middleware_1.authenticate, membership_type_controller_1.getMembershipTypes)
    .post(auth_middleware_1.authenticate, (0, auth_controller_1.authorizeTo)(["admin"]), membership_type_controller_1.createMembershipType);
router
    .route("/:id")
    .get(auth_middleware_1.authenticate, membership_type_controller_1.getMembershipType)
    .patch(auth_middleware_1.authenticate, (0, auth_controller_1.authorizeTo)(["admin"]), membership_type_controller_1.updateMembershipType)
    .delete(auth_middleware_1.authenticate, (0, auth_controller_1.authorizeTo)(["admin"]), membership_type_controller_1.deleteMembershipType);
exports.default = router;
