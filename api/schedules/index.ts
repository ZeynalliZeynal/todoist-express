import kleur from "kleur";
import { taskOverdueSchedule } from "./task.schedule";

export const initializeScheduler = () => {
  console.log(kleur.bgMagenta("Scheduler initialized!"));
  taskOverdueSchedule();
};
