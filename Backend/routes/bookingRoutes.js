// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getAllBookings,
  cancelBooking,
  sendPreRideReminders // 🔥 Import the new controller function
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Create a new booking
router.post("/", protect, createBooking);

// Get all bookings (admin/owner view)
router.get("/", protect, getAllBookings);

// Cancel a booking
router.delete("/:id", protect, cancelBooking);

// 🔥 CRON TRIGGER ENDPOINT (No protect middleware, uses secret key validation)
router.post("/cron/send-reminders", sendPreRideReminders);

export default router;