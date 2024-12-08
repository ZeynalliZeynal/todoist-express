import mongoose from "mongoose";

export interface PlanDocument extends mongoose.Document {
  name: string;
  description: string;
  price: number;
}

const schema = new mongoose.Schema<PlanDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

export default mongoose.model("Plan", schema);
