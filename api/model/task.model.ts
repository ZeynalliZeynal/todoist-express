import mongoose, { Query } from "mongoose";
import slugify from "slugify";
import { addDays, differenceInHours, endOfDay, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

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
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
}

const TIMEZONE = new Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      required: [true, "Name cannot be empty."],
      minlength: [3, "Name must be at least 3 characters"],
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
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaskTag",
      },
    ],
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
      default: () => {
        const now = new Date();
        const hoursLeftToday = differenceInHours(endOfDay(now), now);
        const daysToAdd = hoursLeftToday > 12 ? 1 : 2;

        const localTime = startOfDay(addDays(now, daysToAdd));

        return fromZonedTime(localTime, TIMEZONE);
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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

schema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

schema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;

  if (update?.name) {
    update.slug = slugify(update.name, { lower: true });
    this.set(update);
  }

  next();
});

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v");
  next();
});

// schema.pre(/^find/, function (this: Query<any, any>, next) {
//   // this.populate({
//   //   path: "user",
//   //   select: "-__v",
//   // });
//   next();
// });

const Task = mongoose.model<TaskDocument>("Task", schema);

export default Task;
