"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
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
    plans: [
        {
            planId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Plan",
                index: true,
            },
            value: mongoose_1.default.Schema.Types.Mixed,
        },
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
schema.virtual("allPlans", {
    ref: "Plan",
    localField: "plans.planId",
    foreignField: "_id",
});
exports.default = mongoose_1.default.model("PlanFeature", schema);
