"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationValidator = void 0;
const zod_1 = require("zod");
const notification_model_1 = require("../model/notification.model");
exports.notificationValidator = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "Name is required")
        .min(3, "Name should be at least 3 characters")
        .trim(),
    description: zod_1.z.string().optional(),
    data: zod_1.z.object({}).required(),
    type: zod_1.z.enum(notification_model_1.NOTIFICATION_TYPES, {
        message: `Please provide one of the following type: [${notification_model_1.NOTIFICATION_TYPES.join(", ")}]`,
    }),
    value: zod_1.z.string().trim(),
});
