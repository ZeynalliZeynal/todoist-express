"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeScheduler = void 0;
const kleur_1 = __importDefault(require("kleur"));
const task_schedule_1 = require("./task.schedule");
const initializeScheduler = () => {
    console.log(kleur_1.default.bgMagenta("Scheduler initialized!"));
    (0, task_schedule_1.taskOverdueSchedule)();
};
exports.initializeScheduler = initializeScheduler;
