"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogChangeCategories = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ChangelogChangeCategories = ["client", "server"];
const schema = new mongoose_1.default.Schema({
    message: {
        type: String,
        trim: true,
    },
    scope: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: exports.ChangelogChangeCategories,
        required: true,
    },
    type: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ChangeEntryType",
        required: true,
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
exports.default = mongoose_1.default.model("ChangeEntry", schema);
