import mongoose from "mongoose";

export const NOTIFICATION_TYPES = [
  // task notification types
  "task/overdue",
  "task/due-soon",
  "task/completed",
  "task/updated",
  "task/deleted",
  "task/assigned", // todo

  // project notification types
  "project/deleted",
  "project/updated",
] as const;

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationProps = ReadonlyArray<NotificationType>;

export interface NotificationDocument extends mongoose.Document {
  name: string;
  description: string;
  type: NotificationType;
  data: object;
  archived: boolean;
  read: boolean;

  value: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<NotificationDocument>(
  {
    name: {
      type: String,
      trim: true,
      minLength: [3, "Name must be at least 3 characters long"],
      required: [true, "Name is required"],
      // match: [/^[A-Za-z]+$/, "Name must contain only letters"],
    },
    description: {
      type: String,
      trim: true,
    },
    data: {
      type: Object,
      required: [true, "A notification must have data"],
    },
    type: {
      type: String,
      enum: [
        "task/overdue",
        "task/due-soon",
        "task/completed",
        "task/updated",
        "task/deleted",
        "task/assigned",
        "project/deleted",
        "project/updated",
      ],
      required: [true, "A notification must have a type"],
    },
    archived: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    value: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A notification must contain the related id as value"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export default mongoose.model<NotificationDocument>("Notification", schema);
