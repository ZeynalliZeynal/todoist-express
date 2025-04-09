import mongoose from "mongoose";

export interface ChangeEntryTypeDocument extends mongoose.Document {
  name: string;
  description: string;
}

const schema = new mongoose.Schema<ChangeEntryTypeDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

export default mongoose.model<ChangeEntryTypeDocument>(
  "ChangeEntryType",
  schema
);
