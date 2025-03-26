"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNotificationName = void 0;
const notification_model_1 = require("../model/notification.model");
const generateNotificationName = (type, value) => {
    if (!type || !value)
        throw new Error("Type or value is not specified");
    if (typeof value === "string") {
        switch (type) {
            case notification_model_1.NotificationTypeEnum.TASK_COMPLETED:
                return `The task "${value}" has been completed`;
            case notification_model_1.NotificationTypeEnum.TASK_OVERDUE:
                return `The task "${value}" is overdue`;
            case notification_model_1.NotificationTypeEnum.TASK_DELETED:
                return `The task "${value}" has been deleted`;
            case notification_model_1.NotificationTypeEnum.TASK_CLEARED:
                return `Tasks have been cleared from the project "${value}"`;
            case notification_model_1.NotificationTypeEnum.TASK_UPDATED:
                return `The task "${value}" has been updated`;
            case notification_model_1.NotificationTypeEnum.TASK_DUE_SOON:
                return `The task "${value}" is due soon`;
            case notification_model_1.NotificationTypeEnum.PROJECT_DELETED:
                return `The project "${value}" has been deleted`;
            case notification_model_1.NotificationTypeEnum.PROJECT_UPDATED:
                return `The project "${value}" has been updated`;
        }
    }
    else if (typeof value === "object")
        switch (type) {
            case notification_model_1.NotificationTypeEnum.TASK_ASSIGNED:
                return `The task "${value[0]}" has been assigned to ${value[1]}`;
        }
};
exports.generateNotificationName = generateNotificationName;
