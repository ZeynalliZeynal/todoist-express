import catchErrors from "../utils/catch-errors";
import MemberModel from "../model/member.model";
import { StatusCodes } from "http-status-codes";
import ResponseStatues from "../constants/response-statues";

export const getMembers = catchErrors(async (req, res) => {
  const members = await MemberModel.find({
    active: true,
  });

  res.status(StatusCodes.OK).json({
    status: ResponseStatues.SUCCESS,
    message: "Members fetched successfully",
    data: {
      members,
    },
  });
});

export const getMember = catchErrors(async (req, res) => {});
