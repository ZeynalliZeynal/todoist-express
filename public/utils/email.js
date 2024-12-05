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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../constants/env");
exports.default = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: env_1.email_host,
        auth: {
            user: env_1.email_username,
            pass: env_1.email_password,
        },
    });
    const mailOptions = {
        from: options.from,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html,
    };
    yield transporter.sendMail(mailOptions);
});
const sendMail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ subject, text, to, html }) {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: "7a9d8a001@smtp-brevo.com",
            pass: env_1.brevo_api_key,
        },
    });
    yield transporter.sendMail({
        from: env_1.email_sender,
        to: [...to],
        subject,
        text,
        html,
    });
});
exports.sendMail = sendMail;
