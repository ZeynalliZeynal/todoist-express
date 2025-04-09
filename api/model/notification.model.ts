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

  MEMBER_INVITATION = "member/invitation",
  MEMBER_INVITATION_APPROVED = "member/invitation/approved",
  MEMBER_INVITATION_REJECTED = "member/invitation/rejected",
}

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationProps = ReadonlyArray<NotificationType>;

export interface NotificationDocument extends mongoose.Document {
  name: string;
  description: string;
  data: object;
  archived: boolean;
  read: boolean;
  dismissed: boolean;

  type: mongoose.Types.ObjectId;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotificationType",
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
  }
);

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v -updatedAt");
  next();
});

export default mongoose.model<NotificationDocument>("Notification", schema);
