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
  projects: {
    project: mongoose.Types.ObjectId;
    status: ProjectMemberStatus;
    role: ProjectMemberRole;
    joinedAt: Date;
  }[];

  member: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<ProjectMemberDocument>(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    projects: [
      {
        project: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          required: true,
          unique: [true, "This user is already member to this project."],
        },
        joinedAt: Date,
        role: {
          type: String,
          enum: PROJECT_MEMBER_ROLES,
          default: "member",
        },
        status: {
          type: String,
          enum: PROJECT_MEMBER_STATUSES,
          default: "pending",
        },
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
