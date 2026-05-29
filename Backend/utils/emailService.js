// utils/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // Your company Gmail address
    pass: process.env.GMAIL_APP_PASS,   // Your 16-character Google App Password
  },
});

export const sendReminderEmail = async (toEmail, userName, bikeName, startTime) => {
  const formattedTime = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const mailOptions = {
    from: `"RideShare Fleet" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "🚨 Your Ride Begins in 15 Minutes!",
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2>Hello ${userName},</h2>
        <p>This is a quick reminder that your rental reservation for <strong>${bikeName}</strong> is scheduled to begin at <strong>${formattedTime}</strong>.</p>
        <p>Please make sure you are near your pickup point. Have a safe ride!</p>
        <br />
        <p>Best regards,<br/>The RideShare Operations Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};