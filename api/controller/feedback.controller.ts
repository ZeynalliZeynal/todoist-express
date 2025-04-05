import { StatusCodes } from "http-status-codes";
import FeedbackModel from "../model/feedback.model";
import catchErrors from "../utils/catch-errors";
import { z } from "zod";
import { sendMail } from "../utils/email";
import UserModel from "../model/user.model";
import { admin_email } from "../constants/env";
import { extractTextFromHtml } from "../utils/html.utils";
import AppError from "../utils/app-error";

export const getFeedbacks = catchErrors(async (req, res) => {
  const feedbacks = await FeedbackModel.find({ user: req.userId })
    .populate("user")
    .select("-createdAt");

  res.status(StatusCodes.OK).json({
    status: "success",
    data: {
      feedbacks,
    },
  });
});

export const sendFeedback = catchErrors(async (req, res, next) => {
  const validData = z
    .object({
      content: z
        .string()
        .min(10, "Feedback content must be at least 10 characters"),
      rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
      page: z.string().optional(),
    })
    .parse(req.body);

  const plainText = extractTextFromHtml(validData.content);

  if (plainText.length < 10)
    return next(
      new AppError(
        `Content must be at least 10 characters long.`,
        StatusCodes.BAD_REQUEST
      )
    );

  await FeedbackModel.create({
    ...validData,
    user: req.userId,
  });

  const user = await UserModel.findById(req.userId).select("name email");

  await sendMail({
    to: [admin_email],
    subject: "New feedback",
    text: `New feedback from ${user?.name}, ${user?.email}. Rating: ${validData.rating}.`,
    html: validData.content,
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Your feedback has been sent.",
  });
});
