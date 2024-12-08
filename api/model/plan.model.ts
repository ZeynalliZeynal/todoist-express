import mongoose, { Query } from "mongoose";

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

schema.virtual("allFeatures", {
  ref: "PlanFeature",
  localField: "featureIds",
  foreignField: "_id",
});

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v");
  this.populate({
    path: "allFeatures",
    select: "-__v",
  });
  next();
});

export default mongoose.model("Plan", schema);
