import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

// 🏍️ Add new bike
export const addBike = async (req, res) => {
  try {
    const {
      ownerId,
      bikeName,
      image,
      pricePerHour,
      mileage,
      description,
      tags,
    } = req.body;

    if (
      !ownerId ||
      !bikeName ||
      !image ||
      !pricePerHour ||
      !mileage ||
      !description
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const bike = new Bike({
      ownerId,
      bikeName,
      image,
      pricePerHour,
      mileage,
      description,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim())
        : [],
      available: true,
    });

    await bike.save();
    res.status(201).json({ message: "✅ Bike added successfully", bike });
  } catch (error) {
    console.error("ADD BIKE ERROR:", error);
    res.status(500).json({ message: "❌ Failed to add bike" });
  }
};

// 🔍 Get all bikes (for owners/admins)
export const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find().populate("ownerId", "name email");
    res.json(bikes);
  } catch (error) {
    console.error("GET BIKES ERROR:", error);
    res.status(500).json({ message: "❌ Failed to fetch bikes" });
  }
};

// 🔍 Get only available bikes (for renters)
export const getAvailableBikes = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
      // If not filtering by date/time, return all available bikes
      const bikes = await Bike.find({ available: true }).populate("ownerId", "name email");
      return res.json(bikes);
    }

    const pickup = new Date(`${date}T${startTime}`);
    const drop = new Date(`${date}T${endTime}`);

    // Find bikes that are already booked
    const bookedBikes = await Booking.find({
      $or: [
        { startTime: { $lt: drop }, endTime: { $gt: pickup } } // overlapping
      ]
    }).distinct("bikeId");

    // Find bikes that are available and not booked
    const availableBikes = await Bike.find({
      available: true,
      _id: { $nin: bookedBikes },
    }).populate("ownerId", "name email");

    res.json(availableBikes);
  } catch (error) {
    console.error("FILTER BIKES ERROR:", error);
    res.status(500).json({ message: "❌ Failed to filter bikes" });
  }
};

// 🔍 Get a bike by ID
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

// ✏️ Update bike details
export const updateBike = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Normalize tags if string
    if (updateFields.tags && typeof updateFields.tags === "string") {
      updateFields.tags = updateFields.tags.split(",").map((t) => t.trim());
    }

    const bike = await Bike.findByIdAndUpdate(id, updateFields, { new: true });

    if (!bike) return res.status(404).json({ message: "Bike not found" });

    res.json({ message: "✅ Bike updated successfully", bike });
  } catch (error) {
    console.error("UPDATE BIKE ERROR:", error);
    res.status(500).json({ message: "❌ Failed to update bike" });
  }
};

// 🗑️ Delete bike
export const deleteBike = async (req, res) => {
  try {
    const { id } = req.params;
    const bike = await Bike.findByIdAndDelete(id);

    if (!bike) return res.status(404).json({ message: "Bike not found" });

    res.json({ message: "🗑️ Bike deleted successfully" });
  } catch (error) {
    console.error("DELETE BIKE ERROR:", error);
    res.status(500).json({ message: "❌ Failed to delete bike" });
  }
};
