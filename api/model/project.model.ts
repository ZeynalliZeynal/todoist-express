import mongoose from "mongoose";
import slugify from "slugify";

export interface ProjectDocument extends mongoose.Document {
  name: string;
  description: string;
  logo: string;
  favorite: Boolean;
  slug: string;
  user: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    slug: {
      type: String,
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

schema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.model<ProjectDocument>("Project", schema);
