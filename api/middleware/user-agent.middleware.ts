import { RequestHandler } from "express";
import catchErrors from "../utils/catch-errors";
import requestIp from "request-ip";
import axios from "axios";
import DeviceDetector from "device-detector-js";

export const getUserAgent: RequestHandler = catchErrors(
  async (req, res, next) => {
    const ip = requestIp.getClientIp(req);
    const deviceDetector = new DeviceDetector();
    const userAgent = deviceDetector.parse(req.headers["user-agent"] || "");

    let location;
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json`);

      location = response.data;
    } catch (err) {
      console.error((err as any).response.data);
    }

    req.location = location || "unknown";
    req.userAgent = userAgent;
    next();
  }
);
