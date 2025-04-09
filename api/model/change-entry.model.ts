import mongoose from "mongoose";

export const ChangelogChangeCategories = ["client", "server"] as const;
export type ChangelogChangeCategory =
  (typeof ChangelogChangeCategories)[number];

export interface ChangeEntryDocument extends mongoose.Document {
  type: mongoose.Types.ObjectId;

  category: ChangelogChangeCategory;
  message: string;
  scope?: string;
}

const schema = new mongoose.Schema<ChangeEntryDocument>(
  {
    message: {
      type: String,
      trim: true,
    },
    scope: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ChangelogChangeCategories,
      required: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChangeEntryType",
      required: true,
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

export default mongoose.model<ChangeEntryDocument>("ChangeEntry", schema);
