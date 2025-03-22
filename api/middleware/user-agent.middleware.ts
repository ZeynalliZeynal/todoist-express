import { RequestHandler } from "express";
import catchErrors from "../utils/catch-errors";
import requestIp from "request-ip";
import axios from "axios";
import { apiip_accessKey } from "../constants/env";
import DeviceDetector from "device-detector-js";

export const getUserAgent: RequestHandler = catchErrors(
  async (req, res, next) => {
    const ip = requestIp.getClientIp(req);
    const deviceDetector = new DeviceDetector();
    const userAgent = deviceDetector.parse(req.headers["user-agent"] || "");

    let location;
    try {
      const apiRes = await axios.get(
        `https://apiip.net/api/check?ip=${ip}&accessKey=${apiip_accessKey}`,
      );

      location = apiRes.data;
    } catch (err) {
      console.log("IP is invalid");
    }

    req.location = location || "unknown";
    req.userAgent = userAgent;
    next();
  },
);
