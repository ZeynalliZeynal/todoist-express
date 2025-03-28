"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    preferences: [
        {
            type: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "NotificationType",
                required: true,
            },
            enabled: {
                type: Boolean,
                default: true,
            },
        },
    ],
});
exports.default = mongoose_1.default.model("NotificationSettings", schema);
