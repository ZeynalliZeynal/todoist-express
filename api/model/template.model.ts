import mongoose from "mongoose";

export interface TemplateDocument extends mongoose.Document {
  name: string;
  description: string;
  content: string;
  exampleUrl: string;
  imageUrl?: string;
  category: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  tags: ["list", "board"];
}

const schema = new mongoose.Schema<TemplateDocument>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Name cannot be empty."],
      minlength: [5, "Name must be at least 5 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description cannot be empty."],
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Content cannot be empty."],
      minLength: [50, "Description must be at least 50 characters"],
    },
    exampleUrl: {
      type: String,
      required: [true, "Example URL must be a valid URL"],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TemplateCategory",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

export default mongoose.model<TemplateDocument>("Template", schema);
