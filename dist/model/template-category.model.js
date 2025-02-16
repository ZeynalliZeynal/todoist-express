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
        required: true,
        index: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
schema.virtual("templates", {
    ref: "Template",
    foreignField: "category",
    localField: "_id",
});
exports.default = mongoose_1.default.model("TemplateCategory", schema);
