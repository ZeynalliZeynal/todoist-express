"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEMBER_STATUSES = exports.MEMBER_ROLES = exports.MEMBER_ENTITY_TYPES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.MEMBER_ENTITY_TYPES = ["project"];
exports.MEMBER_ROLES = ["editor", "viewer"];
exports.MEMBER_STATUSES = ["approved", "rejected", "pending"];
const schema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        index: true,
        required: true,
    },
    activated: {
        type: Boolean,
        default: true,
    },
    memberships: [
        {
            entity: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
            },
            entityType: {
                type: String,
                enum: exports.MEMBER_ENTITY_TYPES,
                required: true,
            },
            invited: {
                type: Boolean,
                required: true,
            },
            status: {
                type: String,
                enum: exports.MEMBER_STATUSES,
                default: "pending",
            },
            permissions: [mongoose_1.default.Schema.Types.ObjectId],
            role: {
                type: String,
                enum: exports.MEMBER_ROLES,
                default: "viewer",
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
    this.select("-__v -createdAt");
    next();
});
exports.default = mongoose_1.default.model("Member", schema);
