import mongoose from "mongoose";
import { extractTextFromHtml } from "../utils/html.utils";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

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

// schema.pre("save", async function (next) {
//   const doc = this as FeedbackDocument;

//   const plainText = extractTextFromHtml(doc.content);

//   if (plainText.length < 10) {
//     return next(
//       new mongoose.Error.ValidationError(
//         new AppError(
//           `Content must be at least 10 characters long.`,
//           StatusCodes.BAD_REQUEST
//         )
//       )
//     );
//   }

//   next();
// });

export default mongoose.model<FeedbackDocument>("Feedback", schema);
