import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM = "no-reply@bumi.local",
} = process.env;

function getTransporter() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmailNotification({ to, subject, text }) {
  const transporter = getTransporter();
  if (!transporter || !to) {
    return { delivered: false, reason: "SMTP non configuré" };
  }

  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
  });

  return { delivered: true };
}
