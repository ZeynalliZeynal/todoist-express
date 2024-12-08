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
        unique: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    featureIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "PlanFeature",
        },
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
schema.virtual("allFeatures", {
    ref: "PlanFeature",
    localField: "featureIds",
    foreignField: "_id",
});
schema.pre(/^find/, function (next) {
    this.select("-__v");
    this.populate({
        path: "allFeatures",
        select: "-__v",
    });
    next();
});
exports.default = mongoose_1.default.model("Plan", schema);
