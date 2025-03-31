"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ROLES = ["admin", "user"];
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        required: [true, "Name is required"],
        match: [/^[a-zA-Z0-9\s]+$/, "Name must contain only letters"],
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Email is required"],
        lowercase: true,
        validate: [validator_1.default.isEmail, "Your email is not a valid"],
    },
    avatar: {
        type: String,
        default: function () {
            return `https://avatar.vercel.sh/${encodeURIComponent(this.name)}`;
        },
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
    verifiedAt: { type: Date, select: false },
    verified: { type: Boolean, select: false },
    verificationToken: String,
    location: {
        type: Object,
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false,
    },
    plan: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Plan",
        index: true,
        required: true,
    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});
schema.virtual("tasks", {
    ref: "Task",
    foreignField: "user",
    localField: "_id",
});
schema.virtual("projects", {
    ref: "Project",
    foreignField: "user",
    localField: "_id",
});
schema.virtual("notifications", {
    ref: "Notification",
    foreignField: "user",
    localField: "_id",
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
schema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
schema.method("comparePasswords", function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
});
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
schema.pre(/^find/, function (next) {
    this.select("-__v -createdAt -updatedAt");
    next();
});
exports.default = mongoose_1.default.model("User", schema);
