import mongoose, { Query } from "mongoose";

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

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v -createdAt -updatedAt");
  next();
});

export default mongoose.model<NotificationSettingsDocument>(
  "NotificationSettings",
  schema
);
