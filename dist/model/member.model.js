"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
    },
    memberships: [
        {
            membership: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "MembershipType",
                unique: true,
            },
            active: {
                type: Boolean,
                default: true,
            },
        },
    ],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.default = mongoose_1.default.model("MemberDocument", schema);
