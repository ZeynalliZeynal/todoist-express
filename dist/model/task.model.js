"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const TIMEZONE = new Intl.DateTimeFormat().resolvedOptions().timeZone;
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
        required: [true, "Name cannot be empty."],
        minlength: [3, "Name must be at least 3 characters"],
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
    tags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "TaskTag",
        },
    ],
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
        default: () => {
            const now = new Date();
            const hoursLeftToday = (0, date_fns_1.differenceInHours)((0, date_fns_1.endOfDay)(now), now);
            const daysToAdd = hoursLeftToday > 12 ? 1 : 2;
            return (0, date_fns_tz_1.fromZonedTime)((0, date_fns_1.startOfDay)((0, date_fns_1.addDays)(now, daysToAdd)), TIMEZONE);
        },
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    project: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Project",
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
schema.pre("save", function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
schema.pre(/^find/, function (next) {
    // this.populate({
    //   path: "user",
    //   select: "-__v",
    // });
    next();
});
const Task = mongoose_1.default.model("Task", schema);
exports.default = Task;
