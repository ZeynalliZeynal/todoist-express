import mongoose from "mongoose";

export interface MembershipTypeDocument extends mongoose.Document {
  name: string;
  label: string;
  description?: string;
}

const schema = new mongoose.Schema<MembershipTypeDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "There is already a membership type with this name"],
    },
    label: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
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

export default mongoose.model<MembershipTypeDocument>("MembershipType", schema);
