"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTypeEnum = exports.NOTIFICATION_TYPES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.NOTIFICATION_TYPES = [
    // task notification types
    "task/overdue",
    "task/due-soon",
    "task/completed",
    "task/updated",
    "task/deleted",
    "task/assigned", // todo
    // project notification types
    "project/deleted",
    "project/updated",
];
var NotificationTypeEnum;
(function (NotificationTypeEnum) {
    NotificationTypeEnum["TASK_DUE_SOON"] = "task/due-soon";
    NotificationTypeEnum["TASK_ASSIGNED"] = "task/assigned";
    NotificationTypeEnum["TASK_OVERDUE"] = "task/overdue";
    NotificationTypeEnum["TASK_COMPLETED"] = "task/completed";
    NotificationTypeEnum["TASK_UPDATED"] = "task/updated";
    NotificationTypeEnum["TASK_DELETED"] = "task/deleted";
    NotificationTypeEnum["TASK_CLEARED"] = "task/cleared";
    NotificationTypeEnum["PROJECT_DELETED"] = "project/deleted";
    NotificationTypeEnum["PROJECT_UPDATED"] = "project/updated";
})(NotificationTypeEnum || (exports.NotificationTypeEnum = NotificationTypeEnum = {}));
const schema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        minLength: [3, "Name must be at least 3 characters long"],
        required: [true, "Name is required"],
        // match: [/^[A-Za-z]+$/, "Name must contain only letters"],
    },
    description: {
        type: String,
        trim: true,
    },
    data: {
        type: Object,
        required: [true, "A notification must have data"],
    },
    type: {
        type: String,
        enum: [
            "task/overdue",
            "task/due-soon",
            "task/completed",
            "task/updated",
            "task/deleted",
            "task/assigned",
            "project/deleted",
            "project/updated",
        ],
        required: [true, "A notification must have a type"],
    },
    archived: {
        type: Boolean,
        default: false,
    },
    read: {
        type: Boolean,
        default: false,
    },
    value: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "A notification must contain the related id as value"],
    },
    dismissed: {
        type: Boolean,
        default: false,
        select: false,
    },
    user: {
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
schema.pre(/^find/, function (next) {
    this.select("-__v");
    next();
});
exports.default = mongoose_1.default.model("Notification", schema);
