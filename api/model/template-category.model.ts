import mongoose from "mongoose";

export interface TemplateCategoryDocument extends mongoose.Document {
  name: string;
  description: string;
}

const schema = new mongoose.Schema<TemplateCategoryDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      index: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

schema.virtual("templates", {
  ref: "Template",
  foreignField: "category",
  localField: "_id",
});

export default mongoose.model("TemplateCategory", schema);
