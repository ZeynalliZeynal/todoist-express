import mongoose from "mongoose";
import { addDays } from "date-fns";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: {
    browser: string;
    os: string;
    device: string;
  };
  expiresAt: Date;
}

const schema = new mongoose.Schema<SessionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userAgent: {
      type: Object,
    },
    expiresAt: {
      type: Date,
      default: addDays(new Date(), 30),
    },
  },
  { timestamps: true },
);

export default mongoose.model<SessionDocument>("Session", schema);
