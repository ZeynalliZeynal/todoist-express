import mongoose, { Query } from "mongoose";
import { UserDocument } from "./user.model";

export interface ChangelogDocument extends mongoose.Document {
  title: string;
  description: string;
  version: string;
  images: string[];

  user: UserDocument;
}

const schema = new mongoose.Schema<ChangelogDocument>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    version: {
      type: String,
      trim: true,
      required: true,
    },
    images: [String],
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

schema.pre(/^find/, function (next) {
  (this as Query<any, any>).sort({ createdAt: -1 });
  next();
});

export default mongoose.model<ChangelogDocument>("Changelog", schema);
