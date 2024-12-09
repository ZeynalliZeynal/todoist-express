import mongoose, { Query } from "mongoose";

const STATUSES = ["active", "disabled", "coming soon"] as const;
type PlanStatus = (typeof STATUSES)[number];

export type PlanStatusProps = ReadonlyArray<PlanStatus>;

export interface PlanDocument extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  featureIds: mongoose.Types.ObjectId[];
  status: PlanStatus;
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
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ["active", "disabled", "coming soon"],
      default: "active",
    },
    featureIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlanFeature",
        select: false,
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
  next();
});

export default mongoose.model("Plan", schema);
