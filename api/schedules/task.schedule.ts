import { schedule } from "node-cron";
import Task from "../model/task.model";
import Notification, {
  NotificationTypeEnum,
} from "../model/notification.model";
import kleur from "kleur";
import { generateNotificationName } from "../constants/notification.constant";
import NotificationTypeModel from "../model/notification-type.model";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import { UserDocument } from "../model/user.model";

const taskOverdueSchedule = () => {
  schedule("5 * * * *", async () => {
    try {
      console.log(kleur.yellow("🔄 Running overdue task check..."));

      const now = new Date();

      const overdueTasks = await Task.find({
        dueDate: { $lt: now },
        completed: false,
      }).populate("user");

      if (overdueTasks.length === 0) {
        console.log(kleur.green("0️⃣ overdue task found 👍"));
        return;
      }

      for (const task of overdueTasks) {
        if (!task.user) {
          console.log(
            kleur.red(`⚠️ Task "${task.name}" has no assigned user.`),
          );
          continue;
        }

        const type = await NotificationTypeModel.findOne({
          name: NotificationTypeEnum.TASK_OVERDUE,
        });

        if (!type)
          throw new AppError(
            `No notification type found with the name NotificationTypeEnum.TASK_OVERDUE`,
            StatusCodes.NOT_FOUND,
          );

        const existingNotification = await Notification.findOne({
          value: task._id,
          type: type._id,
          user: task.user._id,
          dismissed: { $ne: true },
        });

        if (!existingNotification) {
          await Notification.create({
            name: generateNotificationName(
              NotificationTypeEnum.TASK_OVERDUE,
              task.name,
            ),
            description: `Your task "${task.name}" is overdue!`,
            data: task,
            value: task._id,
            user: task.user._id,
            type: type._id,
          });

          console.log(
            kleur.magenta(
              `✅ Notification created for ${(task.user as unknown as UserDocument).email}: ${task.name}`,
            ),
          );
        } else {
          console.log(
            kleur.blue(
              `🔹 Notification already exists for ${(task.user as unknown as UserDocument).email}.`,
            ),
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export { taskOverdueSchedule };
