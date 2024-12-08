import mongoose from "mongoose";

export interface PlanDocument extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  featureIds: mongoose.Types.ObjectId[];
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
    featureIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlanFeature",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

schema.virtual("features", {
  ref: "PlanFeature",
  localField: "featureIds",
  foreignField: "_id",
});

export default mongoose.model("Plan", schema);
