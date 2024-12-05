"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const dueDateToday = new Date(new Date(new Date().setDate(new Date(new Date()).getDate() + 1)).setHours(0, 0, 0, 0));
const schema = new mongoose_1.default.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
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
        maxlength: [500, "Description must be at most 500 characters"],
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: [String],
        default: undefined,
    },
    slug: String,
    priority: {
        type: String,
        default: "priority 4",
        enum: {
            values: ["priority 1", "priority 2", "priority 3", "priority 4"],
            message: "Priority must be between priority 1 and priority 4",
        },
    },
    dueDate: {
        type: Date,
        default: dueDateToday,
    },
    userId: {
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
schema.index({ user: 1 });
schema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
schema.pre(/^find/, function (next) {
    // this.populate({
    //   path: "user",
    //   select: "-__v -passwordChangedAt",
    // });
    next();
});
const Task = mongoose_1.default.model("Task", schema);
exports.default = Task;
