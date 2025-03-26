import mongoose, { Query } from "mongoose";

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

export enum NotificationTypeEnum {
  TASK_DUE_SOON = "task/due-soon",
  TASK_ASSIGNED = "task/assigned",
  TASK_OVERDUE = "task/overdue",
  TASK_COMPLETED = "task/completed",
  TASK_UPDATED = "task/updated",
  TASK_DELETED = "task/deleted",
  TASK_CLEARED = "task/cleared",

  PROJECT_DELETED = "project/deleted",
  PROJECT_UPDATED = "project/updated",
}

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationProps = ReadonlyArray<NotificationType>;

export interface NotificationDocument extends mongoose.Document {
  name: string;
  description: string;
  type: NotificationType;
  data: object;
  archived: boolean;
  read: boolean;
  dismissed: boolean;

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
    dismissed: {
      type: Boolean,
      default: false,
      select: false,
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
  },
);

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v");
  next();
});

export default mongoose.model<NotificationDocument>("Notification", schema);
