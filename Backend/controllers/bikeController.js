import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

// 🏍️ Add new bike
export const addBike = async (req, res) => {
  try {
    const { ownerId, bikeName, image, pricePerHour } = req.body;

    if (!ownerId || !bikeName || !image || !pricePerHour) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bike = new Bike({
      ownerId,
      bikeName,
      image,
      pricePerHour,
      available: true,
    });

    await bike.save();
    res.status(201).json({ message: "✅ Bike added successfully", bike });
  } catch (error) {
    console.error("ADD BIKE ERROR:", error);
    res.status(500).json({ message: "❌ Failed to add bike" });
  }
};

// 🔍 Get all available bikes
export const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find({ available: true }).populate("ownerId", "name email");
    res.json(bikes);
  } catch (error) {
    console.error("GET BIKES ERROR:", error);
    res.status(500).json({ message: "❌ Failed to fetch bikes" });
  }
};

// 🔁 Update availability (owner toggles bike availability)
export const updateBikeAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    const bike = await Bike.findByIdAndUpdate(id, { available }, { new: true });

    if (!bike) return res.status(404).json({ message: "Bike not found" });

    res.json({ message: "✅ Availability updated", bike });
  } catch (error) {
    console.error("UPDATE BIKE ERROR:", error);
    res.status(500).json({ message: "❌ Failed to update availability" });
  }
};

export const getAvailableBikes = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing date/time filters" });
    }

    const pickup = new Date(`${date}T${startTime}`);
    const drop = new Date(`${date}T${endTime}`);

    // ✅ find all bikes already booked in that time slot
    const bookedBikes = await Booking.find({
      $or: [
        { startTime: { $lt: drop }, endTime: { $gt: pickup } } // overlapping
      ]
    }).distinct("bikeId");

    // ✅ find all bikes that are available and not in booked list
    const availableBikes = await Bike.find({
      available: true,
      _id: { $nin: bookedBikes }
    }).populate("ownerId", "name email");

    res.json(availableBikes);
  } catch (error) {
    console.error("FILTER BIKES ERROR:", error);
    res.status(500).json({ message: "❌ Failed to filter bikes" });
  }
};

export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate("ownerId", "name email");
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    res.json(bike);
  } catch (error) {
    console.error("GET BIKE BY ID ERROR:", error);
    res.status(500).json({ message: "❌ Failed to fetch bike details" });
  }
};
