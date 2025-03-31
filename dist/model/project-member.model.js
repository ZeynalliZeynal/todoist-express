"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_MEMBER_STATUSES = exports.PROJECT_MEMBER_ROLES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.PROJECT_MEMBER_ROLES = ["member"];
exports.PROJECT_MEMBER_STATUSES = [
    "pending",
    "accepted",
    "rejected",
];
const schema = new mongoose_1.default.Schema({
    member: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
    },
    projects: [
        {
            project: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Project",
                required: true,
                unique: [true, "This user is already member to this project."],
            },
            joinedAt: Date,
            role: {
                type: String,
                enum: exports.PROJECT_MEMBER_ROLES,
                default: "member",
            },
            status: {
                type: String,
                enum: exports.PROJECT_MEMBER_STATUSES,
                default: "pending",
            },
        },
    ],
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});
schema.pre(/^find/, function (next) {
    this.select("-__v");
    next();
});
exports.default = mongoose_1.default.model("ProjectMember", schema);
