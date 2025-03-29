import mongoose, { Query } from "mongoose";

export interface NotificationTypeDocument extends mongoose.Document {
  name: string;
  description: string;
  label: string;
}

const schema = new mongoose.Schema<NotificationTypeDocument>(
  {
    name: {
      type: String,
      trim: true,
      minLength: [3, "Name must be at least 3 characters long"],
      required: true,
      unique: [true, "Name must be unique"],
    },
    label: {
      type: String,
      trim: true,
      minLength: [3, "Label must be at least 3 characters long"],
      match: [/^[A-Za-z\s]+$/, "Label must contain only letters"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v -createdAt -updatedAt");
  next();
});

export default mongoose.model("NotificationType", schema);
