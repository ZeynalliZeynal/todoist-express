import mongoose from "mongoose";
import { addDays } from "date-fns";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: Object;
  location?: any;
  createdAt: Date;
  expiresAt: Date;
}

const schema = new mongoose.Schema<SessionDocument>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 24 * 60 * 60,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userAgent: {
      type: Object,
    },
    location: Object,
    expiresAt: {
      type: Date,
      default: addDays(new Date(), 30),
    },
  },
  { timestamps: true },
);

export default mongoose.model<SessionDocument>("Session", schema);
