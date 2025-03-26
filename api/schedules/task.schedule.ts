import { schedule } from "node-cron";
import Task from "../model/task.model";
import Notification, {
  NotificationTypeEnum,
} from "../model/notification.model";
import User from "../model/user.model";
import kleur from "kleur";
import { generateNotificationName } from "../constants/notification.constant";

const taskOverdueSchedule = () => {
  schedule("* * * * *", async () => {
    try {
      console.log(kleur.yellow("🔄 Running overdue task check..."));

      const users = await User.find();

      for (const user of users) {
        const now = new Date();
        const overdueTasks = await Task.find({
          dueDate: { $lt: now },
          completed: false,
        });

        if (overdueTasks.length === 0) {
          console.log(kleur.green("0️⃣ overdue task found 👍"));
          return;
        }

        for (const task of overdueTasks) {
          const existingNotification = await Notification.findOne({
            value: task._id,
            type: NotificationTypeEnum.TASK_OVERDUE,
            user: user._id,
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
              user: user._id,
              type: NotificationTypeEnum.TASK_OVERDUE,
            });

            console.log(
              kleur.magenta(
                `✅ Notification created for ${user.email}: ${task.name}`,
              ),
            );
          } else {
            console.log(kleur.blue("Notification already exists."));
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export { taskOverdueSchedule };
