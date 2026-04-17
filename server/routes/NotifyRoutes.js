import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import nodemailer from "nodemailer";
import twilio from "twilio";

const NotifyRoutes = express.Router();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

NotifyRoutes.post("/email", protect, async (req, res) => {
  const { to, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    res.send("Email sent");
  } catch (err) {
    res.status(500).send("Error sending email");
  }
});

NotifyRoutes.post("/sms", protect, async (req, res) => {
  const { to, message } = req.body;

  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    res.send("SMS sent " + sms.sid);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed");
  }
});

export default NotifyRoutes;
