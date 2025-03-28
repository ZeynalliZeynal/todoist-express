"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        required: true,
        unique: [true, "Name must be unique"],
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
schema.pre(/^find/, function (next) {
    this.select("-__v -createdAt -updatedAt");
    next();
});
exports.default = mongoose_1.default.model("NotificationType", schema);
