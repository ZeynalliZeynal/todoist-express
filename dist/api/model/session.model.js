"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const date_fns_1 = require("date-fns");
const schema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    userAgent: {
        type: String,
    },
    expiresAt: {
        type: Date,
        default: (0, date_fns_1.addDays)(new Date(), 30),
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Session", schema);
