import nodemailer from "nodemailer";
import { brevo_api_key, email_sender } from "../constants/env";

interface SendMailParams {
  to: string[];
  from?: string;
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({
  subject,
  text,
  to,
  html,
  from,
}: SendMailParams) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "7a9d8a001@smtp-brevo.com",
      pass: brevo_api_key,
    },
  });

  await transporter.sendMail({
    from: from || email_sender,
    to: [...to],
    subject,
    text,
    html,
  });
};
