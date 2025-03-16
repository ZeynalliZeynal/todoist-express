import mongoose from "mongoose";

export interface TaskTagDocument extends mongoose.Document {
  name: string;
  description?: String;
  user: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<TaskTagDocument>(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty."],
      maxlength: [30, "Name must be at most 30 characters"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description must be at most 500 characters"],
      trim: true,
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

const TaskTag = mongoose.model<TaskTagDocument>("TaskTag", schema);

export default TaskTag;
