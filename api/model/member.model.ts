import mongoose, { Query } from "mongoose";

export const MEMBER_ENTITY_TYPES = ["project"] as const;
export const MEMBER_ROLES = ["editor", "viewer"] as const;
export const MEMBER_STATUSES = ["approved", "rejected", "pending"] as const;

export type MemberEntityType = (typeof MEMBER_ENTITY_TYPES)[number];
export type MemberRole = (typeof MEMBER_ROLES)[number];
export type MemberStatus = (typeof MEMBER_STATUSES)[number];

export interface MemberDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  activated: boolean;
  description?: string;
  memberships: [
    {
      entity: object;
      entityType: MemberEntityType;
      status: MemberStatus;
      role: MemberRole;
      invited: boolean;
      permissions: mongoose.Types.ObjectId[];
    }
  ];
}

const schema = new mongoose.Schema<MemberDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    activated: {
      type: Boolean,
      default: true,
    },
    memberships: [
      {
        entity: {
          type: Object,
          required: true,
        },
        entityType: {
          type: String,
          enum: MEMBER_ENTITY_TYPES,
          required: true,
        },
        invited: {
          type: Boolean,
          required: true,
        },
        status: {
          type: String,
          enum: MEMBER_STATUSES,
          default: "pending",
        },
        permissions: [mongoose.Schema.Types.ObjectId],
        role: {
          type: String,
          enum: MEMBER_ROLES,
          default: "viewer",
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
  }
);

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v -createdAt");
  next();
});

export default mongoose.model<MemberDocument>("Member", schema);
