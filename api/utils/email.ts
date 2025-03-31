import nodemailer from "nodemailer";
import { brevo_api_key, email_sender } from "../constants/env";

interface SendMailParams {
  to: string[];
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({ subject, text, to, html }: SendMailParams) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465,
    auth: {
      user: "7a9d8a001@smtp-brevo.com",
      pass: brevo_api_key,
    },
  });

  await transporter.sendMail({
    from: email_sender,
    to: [...to],
    subject,
    text,
    html,
  });
};
