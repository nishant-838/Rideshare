import Booking from "../models/Booking.js";
import Bike from "../models/Bike.js";

export const createBooking = async (req, res) => {
  try {
    const { bikeId, date, startTime, endTime, totalAmount } = req.body;

    const booking = new Booking({
      bikeId,
      date,
      startTime,
      endTime,
      totalAmount,
    });

    await booking.save();

    res.status(201).json({ message: "✅ Booking successful", booking });
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({ message: "❌ Failed to create booking" });
  }
};

// export const getBookingsByUser = async (req, res) => {
//   try {
//     const { renterId } = req.params;
//     const bookings = await Booking.find({ renterId }).populate("bikeId");
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: "❌ Failed to get bookings" });
//   }
// };

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bikeId", "bikeName image pricePerHour")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);
    res.status(500).json({ message: "❌ Failed to fetch bookings" });
  }
};
