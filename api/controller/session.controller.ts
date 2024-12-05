import { RequestHandler } from "express";
import Session from "../model/session.model";
import catchErrors from "../utils/catch-errors";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import AppError from "../utils/app-error";

export const getSessions: RequestHandler = catchErrors(
  async (req, res, next) => {
    const sessions = await Session.find(
      {
        userId: req.userId,
        expiresAt: { $gte: new Date() },
      },
      {
        _id: 1,
        userAgent: 1,
        createdAt: 1,
      },
      { sort: { createdAt: -1 } },
    );

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: sessions.map((session) => ({
        ...session.toObject(),
        ...(session.id === req.sessionId && {
          current: true,
        }),
      })),
    });
  },
);

export const deleteSession: RequestHandler = catchErrors(
  async (req, res, next) => {
    const sessionId = z.string().parse(req.params.id);
    const session = await Session.deleteOne({
      _id: sessionId,
      userId: req.userId,
    });

    if (!session)
      return next(new AppError("No session found.", StatusCodes.NOT_FOUND));

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "Session successfully deleted.",
    });
  },
);
