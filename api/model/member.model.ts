import mongoose from "mongoose";

export interface MemberDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  memberships: {
    membership: mongoose.Types.ObjectId;
    active: boolean;
  }[];
}

const schema = new mongoose.Schema<MemberDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    memberships: [
      {
        membership: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MembershipType",
          unique: true,
        },
        active: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<MemberDocument>("MemberDocument", schema);
