import Booking from "../models/Booking.js";
import Bike from "../models/Bike.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";

dotenv.config();

// ✉️ NODEMAILER CONFIGURATION (Production Gmail Driver)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,       // Your production Gmail address
    pass: process.env.GMAIL_APP_PASS,   // Your 16-character Google App Password
  },
});

// Helper: Send automated email alert via Nodemailer
const sendReminderEmail = async (toEmail, userName, bikeName, startTime) => {
  // 🔥 FIX 1: Enforce explicit Indian Standard Time format configuration so it displays local time in the email text
  const formattedTime = new Date(startTime).toLocaleTimeString("en-IN", { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
  
  const mailOptions = {
    from: `"RideShare Fleet" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "🚨 Your Ride Begins in 15 Minutes!",
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 500px;">
        <h2 style="color: #2c3e50; margin-top: 0;">Hello ${userName},</h2>
        <p style="font-size: 16px; color: #34495e;">
          This is a quick reminder that your rental reservation for <strong>${bikeName}</strong> is scheduled to begin at <strong>${formattedTime}</strong>.
        </p>
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
          <strong>Pickup Time:</strong> ${formattedTime} <br />
          <strong>Vehicle:</strong> ${bikeName}
        </div>
        <p style="font-size: 14px; color: #7f8c8d;">Please ensure you are near your pickup point. Have a safe ride!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #bdc3c7; margin-bottom: 0;">Best regards,<br/>The RideShare Operations Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// 📱 SMS CONFIGURATION (2Factor Service)
const sendSMS = async (mobile, message) => {
  try {
    const apiKey = process.env.TWOFACTOR_API_KEY;
    const senderId = process.env.SENDER_ID;

    let formattedMobile = mobile.toString().trim();
    if (!formattedMobile.startsWith("91")) {
      formattedMobile = "91" + formattedMobile;
    }

    const url = `https://2factor.in/API/V1/${apiKey}/ADDON_SERVICES/SEND/TSMS?to=${formattedMobile}&message=${encodeURIComponent(
      message
    )}&sender=${senderId}`;

    const response = await axios.get(url);
    console.log("📨 SMS sent via 2Factor:", response.data);
  } catch (error) {
    console.error("❌ Failed to send SMS (2Factor):", error.response?.data || error.message);
  }
};

// ➕ CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { bikeId, date, startTime, endTime, totalAmount, mobile } = req.body;
    const renterId = req.user._id;

    if (!bikeId || !date || !startTime || !endTime || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    const pickupTime = new Date(startTime);
    const dropTime = new Date(endTime);

    if (pickupTime >= dropTime) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const overlappingBooking = await Booking.findOne({
      bikeId,
      startTime: { $lt: dropTime },
      endTime: { $gt: pickupTime },
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Bike already booked for selected time slot" });
    }

    // Create the booking record
    const booking = await Booking.create({
      bikeId,
      renterId,
      date,
      startTime: pickupTime,
      endTime: dropTime,
      totalAmount,
      reminderSent: false 
    });

    let mobileNumber = mobile;
    if (!mobileNumber) {
      const user = await User.findById(renterId);
      mobileNumber = user?.mobile;
    }

    if (mobileNumber) {
      // 🔥 FIX 2: Helper utility to convert raw ISO back to user's localized text for the confirmation SMS
      const formatTimeLocal = (d) => new Date(d).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      const message =
        `Your booking for ${bike.bikeName} on ${date} ` +
        `from ${formatTimeLocal(pickupTime)} to ${formatTimeLocal(dropTime)} is confirmed! ` +
        `Total: ₹${totalAmount}. RideShare 🚴‍♂️`;

      await sendSMS(mobileNumber, message);
    }

    res.status(201).json({ success: true, message: "Booking successful", booking });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to create booking" });
  }
};

// 🔍 GET ALL BOOKINGS (For logged-in user)
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ renterId: userId })
      .populate("bikeId", "bikeName image pricePerHour ratings avgRating")
      .sort({ createdAt: -1 });

    const currentTime = new Date();

    const bookingsWithUserRating = bookings.map((b) => {
      const isPastBooking = new Date(b.endTime) <= currentTime;

      const userRating = isPastBooking
        ? b.bikeId?.ratings?.find((r) => r.userId.toString() === userId.toString())?.value
        : null;

      return {
        ...b._doc,
        userRating: userRating || null,
      };
    });

    res.json(bookingsWithUserRating);
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ❌ CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.renterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const now = new Date();
    const start = new Date(booking.startTime);
    const diffInHours = (start - now) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return res.status(400).json({
        message: "Cannot cancel booking less than 1 hour before pickup time",
      });
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled and payment refunded successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

// ⏰ AUTOMATED CRONCONTROLLER: Send Pre-Ride Gmail Notifications
export const sendPreRideReminders = async (req, res) => {
  const cronSecret = req.headers["x-cron-secret"];
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ success: false, message: "Unauthorized trigger context" });
  }

  try {
    const now = new Date();
    const targetMinWindow = new Date(now.getTime() + 13 * 60 * 1000);
    const targetMaxWindow = new Date(now.getTime() + 18 * 60 * 1000);

    const upcomingBookings = await Booking.find({
      startTime: { $gte: targetMinWindow, $lte: targetMaxWindow },
      $or: [{ reminderSent: false }, { reminderSent: { $exists: false } }]
    }).populate("renterId").populate("bikeId");

    let emailCount = 0;

    for (const booking of upcomingBookings) {
      if (booking.renterId?.email && booking.bikeId) {
        try {
          await sendReminderEmail(
            booking.renterId.email,
            booking.renterId.name,
            booking.bikeId.bikeName,
            booking.startTime
          );

          await Booking.findByIdAndUpdate(booking._id, { $set: { reminderSent: true } });
          emailCount++;
        } catch (emailErr) {
          console.error(`Error sending email for Booking ${booking._id}:`, emailErr);
        }
      }
    }

    res.status(200).json({ 
      success: true, 
      message: `Successfully processed alerts scheme.`, 
      emailsSent: emailCount 
    });
  } catch (error) {
    console.error("CRON TASK RUNTIME ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};