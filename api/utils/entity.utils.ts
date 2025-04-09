import { StatusCodes } from "http-status-codes";
import projectModel from "../model/project.model";
import AppError from "./app-error";

export async function getEntityByType(entityType: string, entityId: string) {
  switch (entityType) {
    case "PROJECT":
      return await projectModel.findById(entityId);

    default:
      throw new AppError("Invalid entity type", StatusCodes.BAD_REQUEST);
  }
}
