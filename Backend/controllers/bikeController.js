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
      vehicleType,
    } = req.body;

    if (!ownerId || !bikeName || !image || !pricePerHour || !mileage || !description) {
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
      vehicleType,
      available: true,
      ratings: [], // initialize ratings array
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
      const bikes = await Bike.find({ available: true }).populate("ownerId", "name email");
      return res.json(bikes);
    }

    const pickup = new Date(`${date}T${startTime}`);
    const drop = new Date(`${date}T${endTime}`);

    const bookedBikes = await Booking.find({
      $or: [{ startTime: { $lt: drop }, endTime: { $gt: pickup } }]
    }).distinct("bikeId");

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

    // FIND BIKE
    const bike = await Bike.findById(id);

    if (!bike) {
      return res.status(404).json({
        message: "Bike not found",
      });
    }

    // OWNER CHECK
    if (bike.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this bike",
      });
    }

    // TAG PARSING
    if (
      updateFields.tags &&
      typeof updateFields.tags === "string"
    ) {
      updateFields.tags = updateFields.tags
        .split(",")
        .map((t) => t.trim());
    }

    // UPDATE
    Object.assign(bike, updateFields);

    await bike.save();

    res.json({
      success: true,
      message: "Bike updated successfully",
      bike,
    });
  } catch (error) {
    console.error("UPDATE BIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update bike",
    });
  }
};

// 🗑️ Delete bike
export const deleteBike = async (req, res) => {
  try {
    const { id } = req.params;

    const bike = await Bike.findById(id);

    if (!bike) {
      return res.status(404).json({
        message: "Bike not found",
      });
    }

    // OWNER VALIDATION
    if (bike.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this bike",
      });
    }

    await bike.deleteOne();

    res.json({
      success: true,
      message: "Bike deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete bike",
    });
  }
};

// ⭐ Rate a bike (user can rate only if they completed a booking)
export const rateBike = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user._id; // protect middleware sets req.user

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user had a past booking
    const pastBooking = await Booking.findOne({
      bikeId: id,
      renterId: userId,
      endTime: { $lt: new Date() }
    });

    if (!pastBooking) {
      return res.status(403).json({ message: "You can only rate bikes you have ridden" });
    }

    const bike = await Bike.findById(id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    // Remove previous rating by same user
    bike.ratings = bike.ratings.filter((r) => r.userId.toString() !== userId.toString());

    // Add new rating
    bike.ratings.push({ userId, value: rating });

    // Calculate average rating
    const total = bike.ratings.reduce((sum, r) => sum + r.value, 0);
    bike.avgRating = total / bike.ratings.length;

    await bike.save();

    res.json({ message: "✅ Rating submitted", avgRating: bike.avgRating });
  } catch (error) {
    console.error("RATE BIKE ERROR:", error);
    res.status(500).json({ message: "❌ Failed to submit rating" });
  }
};

// 🔍 Get bike ratings (avg + all ratings)
export const getBikeRatings = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate("ratings.userId", "name");
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    const avgRating = bike.ratings.length
      ? bike.ratings.reduce((sum, r) => sum + r.value, 0) / bike.ratings.length
      : 0;

    res.json({ avgRating, ratings: bike.ratings });
  } catch (error) {
    console.error("GET BIKE RATINGS ERROR:", error);
    res.status(500).json({ message: "❌ Failed to fetch ratings" });
  }
};
