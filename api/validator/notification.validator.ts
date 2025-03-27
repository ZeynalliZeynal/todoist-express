import { z } from "zod";
import { NOTIFICATION_TYPES } from "../model/notification.model";

export const notificationValidator = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name should be at least 3 characters")
    .trim(),
  description: z.string().optional(),
  data: z.object({}).passthrough().required(),
  type: z.enum(NOTIFICATION_TYPES, {
    message: `Please provide one of the following type: [${NOTIFICATION_TYPES.join(
      ", "
    )}]`,
  }),
  value: z.string().trim(),
});
