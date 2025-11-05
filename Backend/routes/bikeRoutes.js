import express from "express";
import {
  addBike,
  getAllBikes,
  getAvailableBikes,
  getBikeById,
  updateBike,
  deleteBike,
} from "../controllers/bikeController.js";

const router = express.Router();

// 🏍️ Add new bike (only for owners)
router.post("/", addBike);

// 🔍 Get all bikes
router.get("/", getAllBikes);

// 🔍 Get available bikes (for renters)
router.get("/available", getAvailableBikes);

// 🔍 Get single bike by ID
router.get("/:id", getBikeById);

// ✏️ Update a bike (edit feature)
router.put("/:id", updateBike);

// 🗑️ Delete a bike
router.delete("/:id", deleteBike);

export default router;
