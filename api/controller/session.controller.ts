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

    const mappedSessions = sessions.map((session) => ({
      ...session.toObject(),
      current: session.id === req.sessionId,
    }));

    mappedSessions.sort((a, b) => (b.current ? 1 : a.current ? -1 : 0));

    return res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        sessions: mappedSessions,
      },
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
