import mongoose from "mongoose";

export interface NotificationSettingsDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  preferences: {
    type: mongoose.Types.ObjectId;
    enabled: boolean;
  }[];
}

const schema = new mongoose.Schema<NotificationSettingsDocument>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  preferences: [
    {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NotificationType",
        required: true,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

export default mongoose.model<NotificationSettingsDocument>(
  "NotificationSettings",
  schema,
);
