import express from "express";
import {
  createBooking,
  getAllBookings,
  cancelBooking
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

//  Create a new booking
router.post("/",protect, createBooking);

// Get all bookings (admin/owner view)
router.get("/",protect, getAllBookings);

router.delete("/:id", protect, cancelBooking);


export default router;

