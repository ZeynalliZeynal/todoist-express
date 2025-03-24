"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgent = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const request_ip_1 = __importDefault(require("request-ip"));
const axios_1 = __importDefault(require("axios"));
const device_detector_js_1 = __importDefault(require("device-detector-js"));
exports.getUserAgent = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = request_ip_1.default.getClientIp(req);
    const deviceDetector = new device_detector_js_1.default();
    const userAgent = deviceDetector.parse(req.headers["user-agent"] || "");
    let location;
    try {
        const response = yield axios_1.default.get(`https://ipapi.co/${ip}/json`);
        location = response.data;
    }
    catch (err) {
        console.error(err.response.data);
    }
    req.location = location || "unknown";
    req.userAgent = userAgent;
    next();
}));
