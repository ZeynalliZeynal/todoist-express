import mongoose, { Query } from "mongoose";
import slugify from "slugify";

export type Priorities =
  | "priority 1"
  | "priority 2"
  | "priority 3"
  | "priority 4";

export interface TaskDocument extends mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: String;
  completed?: boolean;
  tags?: string[];
  slug: string;
  priority: Priorities;
  dueDate?: Date;
  userId: mongoose.Types.ObjectId;
}

const dueDateToday = new Date(
  new Date(new Date().setDate(new Date(new Date()).getDate() + 1)).setHours(
    0,
    0,
    0,
    0,
  ),
);

const schema = new mongoose.Schema<TaskDocument>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
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
      maxlength: [500, "Description must be at most 500 characters"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: undefined,
    },
    slug: String,
    priority: {
      type: String,
      default: "priority 4",
      enum: {
        values: ["priority 1", "priority 2", "priority 3", "priority 4"],
        message: "Priority must be between priority 1 and priority 4",
      },
    },
    dueDate: {
      type: Date,
      default: dueDateToday,
    },
    userId: {
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

schema.index({ user: 1 });

schema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

schema.pre(/^find/, function (this: Query<any, any>, next) {
  // this.populate({
  //   path: "user",
  //   select: "-__v -passwordChangedAt",
  // });
  next();
});

const Task = mongoose.model<TaskDocument>("Task", schema);

export default Task;
