import Booking from "../models/Booking.js";
import Bike from "../models/Bike.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

//  Send booking confirmation SMS via 2Factor
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
    console.log(" SMS sent via 2Factor:", response.data);
  } catch (error) {
    console.error(" Failed to send SMS (2Factor):", error.response?.data || error.message);
  }
};

// Create Booking
export const createBooking = async (req, res) => {
  try {
    const { bikeId, date, startTime, endTime, totalAmount, mobile } = req.body;
    const renterId = req.user._id; // logged-in user ID

    if (!bikeId || !date || !startTime || !endTime || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    const booking = await Booking.create({
      bikeId,
      renterId,
      date,
      startTime,
      endTime,
      totalAmount,
    });

    // Get mobile from user if not provided
    let mobileNumber = mobile;
    if (!mobileNumber) {
      const user = await User.findById(renterId);
      mobileNumber = user?.mobile;
    }

    if (mobileNumber) {
      const message = `Your booking for ${bike.bikeName} on ${date} from ${startTime} to ${endTime} is confirmed! Total: ₹${totalAmount}. Enjoy your ride with RideShare 🚴‍♂️`;
      await sendSMS(mobileNumber, message);
    }

    res.status(201).json({ message: " Booking successful", booking });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

//  Get Bookings of Logged-in User
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
        ? b.bikeId.ratings.find((r) => r.userId.toString() === userId.toString())?.value
        : null;

      return {
        ...b._doc,
        userRating: userRating || null,
      };
    });

    res.json(bookingsWithUserRating);
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);
    res.status(500).json({ message: " Failed to fetch bookings" });
  }
};



//Cancel Booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ensure user owns this booking
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

    await booking.deleteOne(); // or mark status: 'cancelled' if you prefer

    res.json({ message: "Booking cancelled and payment refunded successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};
