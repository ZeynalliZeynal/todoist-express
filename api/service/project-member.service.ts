import ProjectMemberModel, {
  ProjectMemberDocument,
} from "../model/project-member.model";
import { z } from "zod";
import AppError from "../utils/app-error";
import { StatusCodes } from "http-status-codes";
import ProjectModel from "../model/project.model";
import mongoose from "mongoose";

export const createProjectMemberService = async (
  user: mongoose.Types.ObjectId,
  data: ProjectMemberDocument,
) => {
  const validData = z
    .object({
      role: z.string().default("member").optional(),
      active: z.boolean().default(true).optional(),
      status: z.string().default("pending").optional(),
    })
    .strict()
    .parse(data);

  const existingMember = await ProjectMemberModel.exists({
    user: user,
  });

  if (existingMember)
    throw new AppError(
      "You are already a registered member. You can join or get invited to projects",
      StatusCodes.CONFLICT,
    );

  return await ProjectMemberModel.create({
    user: user,
    role: validData.role,
    active: validData.active,
    status: validData.status,
  });
};

export const deleteProjectMemberService = async (id: string) => {
  const validId = z.string().parse(id);

  const deletedMember = await ProjectMemberModel.findByIdAndDelete(id);

  if (!deletedMember)
    throw new AppError(
      "There is no registered member with this id",
      StatusCodes.NOT_FOUND,
    );

  await ProjectModel.updateMany(
    { "members.member": validId },
    { $pull: { members: { member: validId } } },
  );
};
