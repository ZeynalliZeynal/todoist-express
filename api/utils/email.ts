import nodemailer from "nodemailer";
import {
  brevo_api_key,
  email_host,
  email_password,
  email_sender,
  email_username,
} from "../constants/env";

export default async (options: {
  from: string;
  subject: string;
  email: string;
  message?: string;
  html?: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: email_host,
    auth: {
      user: email_username,
      pass: email_password,
    },
  });

  const mailOptions = {
    from: options.from,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

interface SendMailParams {
  to: [string];
  subject: string;
  text: string;
  html: string;
}

export const sendMail = async ({ subject, text, to, html }: SendMailParams) => {
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
    from: email_sender,
    to: [...to],
    subject,
    text,
    html,
  });
};
