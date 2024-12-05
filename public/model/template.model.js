"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },
    name: {
        type: String,
        unique: true,
        required: [true, "Name cannot be empty."],
        minlength: [5, "Name must be at least 5 characters"],
        maxlength: [50, "Name must be at most 50 characters"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, "Description cannot be empty."],
    },
    content: {
        type: String,
        trim: true,
        required: [true, "Content cannot be empty."],
        minLength: [50, "Description must be at least 50 characters"],
    },
    exampleUrl: {
        type: String,
        required: [true, "Example URL must be a valid URL"],
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
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
exports.default = mongoose_1.default.model("Template", schema);
