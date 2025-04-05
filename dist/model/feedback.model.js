"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
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
});
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
exports.default = mongoose_1.default.model("Feedback", schema);
