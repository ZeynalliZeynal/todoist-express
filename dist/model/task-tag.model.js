"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name cannot be empty."],
        maxlength: [30, "Name must be at most 30 characters"],
        trim: true,
    },
    description: {
        type: String,
        maxlength: [500, "Description must be at most 500 characters"],
        trim: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
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
const TaskTag = mongoose_1.default.model("TaskTag", schema);
exports.default = TaskTag;
