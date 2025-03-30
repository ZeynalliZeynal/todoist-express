import mongoose, { Query } from "mongoose";

export const PROJECT_MEMBER_ROLES = ["member"] as const;
export const PROJECT_MEMBER_STATUSES = [
  "pending",
  "accepted",
  "rejected",
] as const;

type ProjectMemberRole = (typeof PROJECT_MEMBER_ROLES)[number];
type ProjectMemberStatus = (typeof PROJECT_MEMBER_STATUSES)[number];

export interface ProjectMemberDocument extends mongoose.Document {
  joinedAt: Date;
  leftAt: Date;

  role: ProjectMemberRole;
  status: ProjectMemberStatus;

  permissions: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<ProjectMemberDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: PROJECT_MEMBER_ROLES,
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: Date,
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
        required: true,
      },
    ],
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

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v");
  next();
});

export default mongoose.model<ProjectMemberDocument>("ProjectMember", schema);
