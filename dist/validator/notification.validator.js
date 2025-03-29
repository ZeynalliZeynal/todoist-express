"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationValidator = void 0;
const zod_1 = require("zod");
exports.notificationValidator = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .min(3, "Name should be at least 3 characters")
        .trim(),
    description: zod_1.z.string().optional(),
    data: zod_1.z.object({}).passthrough().required(),
    type: zod_1.z.string(),
    value: zod_1.z.string().trim(),
});
