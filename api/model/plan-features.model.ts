import mongoose from "mongoose";

export interface PlanFeaturesDocument extends mongoose.Document {
  title: string;
  name: string;
  description: string;
  plans: {
    planId: mongoose.Types.ObjectId;
    value: mongoose.Schema.Types.Mixed;
  }[];
}

const schema = new mongoose.Schema<PlanFeaturesDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
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
    plans: [
      {
        planId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Plan",
          index: true,
        },
        value: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

schema.virtual("allPlans", {
  ref: "Plan",
  localField: "plans.planId",
  foreignField: "_id",
});

export default mongoose.model("PlanFeature", schema);
