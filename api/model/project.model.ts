import mongoose from "mongoose";

export interface ProjectDocument extends mongoose.Document {
  name: string;
  description: string;
  logo: string;
  user: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
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

export default mongoose.model<ProjectDocument>("Project", schema);
