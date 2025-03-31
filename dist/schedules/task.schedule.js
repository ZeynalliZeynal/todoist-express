"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskOverdueSchedule = void 0;
const node_cron_1 = require("node-cron");
const task_model_1 = __importDefault(require("../model/task.model"));
const notification_model_1 = __importStar(require("../model/notification.model"));
const kleur_1 = __importDefault(require("kleur"));
const notification_constant_1 = require("../constants/notification.constant");
const notification_type_model_1 = __importDefault(require("../model/notification-type.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const taskOverdueSchedule = () => {
    (0, node_cron_1.schedule)("5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(kleur_1.default.yellow("🔄 Running overdue task check..."));
            const now = new Date();
            const overdueTasks = yield task_model_1.default.find({
                dueDate: { $lt: now },
                completed: false,
            }).populate("user");
            if (overdueTasks.length === 0) {
                console.log(kleur_1.default.green("0️⃣ overdue task found 👍"));
                return;
            }
            for (const task of overdueTasks) {
                if (!task.user) {
                    console.log(kleur_1.default.red(`⚠️ Task "${task.name}" has no assigned user.`));
                    continue;
                }
                const type = yield notification_type_model_1.default.findOne({
                    name: notification_model_1.NotificationTypeEnum.TASK_OVERDUE,
                });
                if (!type)
                    throw new app_error_1.default(`No notification type found with the name NotificationTypeEnum.TASK_OVERDUE`, http_status_codes_1.StatusCodes.NOT_FOUND);
                const existingNotification = yield notification_model_1.default.findOne({
                    value: task._id,
                    type: type._id,
                    user: task.user._id,
                    dismissed: { $ne: true },
                });
                if (!existingNotification) {
                    yield notification_model_1.default.create({
                        name: (0, notification_constant_1.generateNotificationName)(notification_model_1.NotificationTypeEnum.TASK_OVERDUE, task.name),
                        description: `Your task "${task.name}" is overdue!`,
                        data: task,
                        value: task._id,
                        user: task.user._id,
                        type: type._id,
                    });
                    console.log(kleur_1.default.magenta(`✅ Notification created for ${task.user.email}: ${task.name}`));
                }
                else {
                    console.log(kleur_1.default.blue(`🔹 Notification already exists for ${task.user.email}.`));
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }));
};
exports.taskOverdueSchedule = taskOverdueSchedule;
