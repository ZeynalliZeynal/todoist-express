import mongoose from "mongoose";

export interface FeedbackDocument extends mongoose.Document {
  content: string;
  rating: number;
  page?: string;

  user: mongoose.Types.ObjectId;
}
const schema = new mongoose.Schema<FeedbackDocument>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: [10, "Feedback content must be at least 10 characters"],
    },
    rating: {
      type: Number,
      required: true,
      max: [5, "Rating must be less than or equal to 5"],
      min: [1, "Rating must be greater than or equal to 1"],
    },
    page: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model<FeedbackDocument>("Feedback", schema);
