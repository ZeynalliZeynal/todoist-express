import { NotificationTypeEnum } from "../model/notification.model";

export const generateNotificationName = (
  type: NotificationTypeEnum,
  value: string | string[]
) => {
  if (!type || !value) throw new Error("Type or value is not specified");

  if (typeof value === "string") {
    switch (type) {
      case NotificationTypeEnum.TASK_COMPLETED:
        return `The task "${value}" has been completed`;
      case NotificationTypeEnum.TASK_OVERDUE:
        return `The task "${value}" is overdue`;
      case NotificationTypeEnum.TASK_DELETED:
        return `The task "${value}" has been deleted`;
      case NotificationTypeEnum.TASK_CLEARED:
        return `Tasks have been cleared from the project "${value}"`;
      case NotificationTypeEnum.TASK_UPDATED:
        return `The task "${value}" has been updated`;
      case NotificationTypeEnum.TASK_DUE_SOON:
        return `The task "${value}" is due soon`;

      case NotificationTypeEnum.PROJECT_DELETED:
        return `The project "${value}" has been deleted`;
      case NotificationTypeEnum.PROJECT_UPDATED:
        return `The project "${value}" has been updated`;

      case NotificationTypeEnum.MEMBER_INVITATION:
        return `You are invited to a member of "${value}"`;
    }
  } else if (typeof value === "object")
    switch (type) {
      case NotificationTypeEnum.TASK_ASSIGNED:
        return `The task "${value[0]}" has been assigned to ${value[1]}`;
      case NotificationTypeEnum.MEMBER_INVITATION_APPROVED:
        return `${value[0]} approved your invitation to "${value[1]}"`;
      case NotificationTypeEnum.MEMBER_INVITATION_REJECTED:
        return `${value[0]} rejected your invitation to "${value[1]}"`;
    }
};
