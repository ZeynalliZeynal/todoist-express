import mongoose, { Document, Query } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const ROLES = ["admin", "user"] as const;
type UserRole = (typeof ROLES)[number];

export type RoleProps = ReadonlyArray<UserRole>;

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  role: UserRole;
  photo?: string;
  // password: string;
  // confirmPassword?: string;
  // passwordChangedAt?: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  isActive: boolean;
  verifiedAt?: Date;
  verified?: boolean;
  verificationToken?: string;
  location?: {
    city: string;
    country: string;
    continent: string;
  };
  planId: mongoose.Types.ObjectId;

  comparePasswords(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;

  isPasswordChangedAfter(JWTTimestamp?: number): boolean;

  createResetPasswordToken(): string;

  createVerificationToken(): string;
}

const schema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
      lowercase: true,
      validate: [validator.isEmail, "Your email is not a valid"],
    },
    // password: {
    //   type: String,
    //   required: [true, "Password is required"],
    //   minlength: [8, "Password must be at least 8 characters"],
    //   select: false,
    // },
    // confirmPassword: {
    //   type: String,
    //   required: [true, "Please confirm your password"],
    //   validate: {
    //     // * works only on save
    //     validator: function (value) {
    //       return value === this.password;
    //     },
    //     message: "Passwords must match",
    //   },
    // },
    // passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      select: false,
    },
    photo: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verifiedAt: Date,
    verified: Boolean,
    verificationToken: String,
    location: {
      type: Object,
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      index: true,
      required: true,
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
  }
);

schema.virtual("tasks", {
  ref: "Task",
  foreignField: "userId", // foreign key
  localField: "_id", // primary key
});

schema.virtual("plan", {
  ref: "Plan",
  foreignField: "_id", // foreign key
  localField: "planId", // primary key
});

// schema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//
//   this.password = await bcrypt.hash(this.password as string, 12);
//   this.confirmPassword = undefined;
//
//   next();
// });

// schema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew) return next();
//
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

schema.pre<Query<any, Document>>(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

schema.method(
  "comparePasswords",
  async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
);

// schema.method("isPasswordChangedAfter", function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       String(new Date(this.passwordChangedAt).getTime() / 1000),
//       10,
//     );
//
//     return JWTTimestamp < changedTimestamp;
//   }
//   return false;
// });

// schema.method("createResetPasswordToken", function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.resetPasswordExpires = addMinutes(Date.now(), 5).getTime();
//
//   return resetToken;
// });

// schema.method("createVerificationToken", function () {
//   const verificationToken = crypto.randomBytes(32).toString("hex");
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(verificationToken)
//     .digest("hex");
//
//   return verificationToken;
// });

schema.pre(/^find/, function (this: Query<any, any>, next) {
  this.select("-__v");
  next();
});

export default mongoose.model<UserDocument>("User", schema);
