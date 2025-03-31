import mongoose from "mongoose";
import slugify from "slugify";

export interface ProjectDocument extends mongoose.Document {
  name: string;
  description: string;
  logo: string;
  favorite: Boolean;
  slug: string;

  members: {
    member: mongoose.Types.ObjectId;
    joinedAt: Date;
    permissions: mongoose.Types.ObjectId[];
  }[];
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
    members: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProjectMember",
        },
        permissions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Permission",
          },
        ],
      },
    ],
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

schema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
});

schema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.model<ProjectDocument>("Project", schema);
