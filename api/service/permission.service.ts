import PermissionModel, { PermissionDocument } from "../model/permission.model";
import { z } from "zod";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import ProjectMemberModel from "../model/project-member.model";

export const createPermissionService = async (data: PermissionDocument) => {
  const validData = z
    .object({
      name: z.string().trim(),
      label: z.string().trim(),
      description: z.string().trim().optional(),
    })
    .strict()
    .parse(data);

  const existingPermission = await PermissionModel.exists({
    name: validData.name,
  });

  if (existingPermission)
    throw new AppError(
      `Permission already exists with the name ${validData.name}`,
      StatusCodes.CONFLICT,
    );

  const newPermission = await PermissionModel.create({
    name: validData.name,
    description: validData.description,
    label: validData.label,
  });

  return newPermission;
};

export const deletePermissionService = async (id: string) => {
  const validData = z.string().parse(id);

  const deletedPermission = await PermissionModel.findByIdAndDelete(id);

  if (!deletedPermission)
    throw new AppError(
      `Not found permission with id ${validData}`,
      StatusCodes.NOT_FOUND,
    );

  await ProjectMemberModel.updateMany(
    { permissions: validData },
    { $pull: { permissions: validData } },
  );
};
