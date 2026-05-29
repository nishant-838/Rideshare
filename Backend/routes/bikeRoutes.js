import express from "express";
import multer from "multer"; // 🚀 Added to process raw binary file packets
import {
  addBike,
  getAllBikes,
  getAvailableBikes,
  getBikeById,
  updateBike,
  deleteBike,
  rateBike,
  getBikeRatings,
} from "../controllers/bikeController.js";

import {
  protect,
  ownerOnly,
} from "../middlewares/auth.js";

const router = express.Router();

// Configure memory buffers for multi-part forms
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🚀 Pass upload.single("image") into the create and update route pathways
router.post("/", protect, ownerOnly, upload.single("image"), addBike);
router.put("/:id", protect, ownerOnly, upload.single("image"), updateBike);

// PUBLIC
router.get("/", getAllBikes);
router.get("/available", getAvailableBikes);
router.get("/:id", getBikeById);

// OWNER ONLY REMOVAL
router.delete("/:id", protect, ownerOnly, deleteBike);

// AUTH REQUIRED
router.post("/:id/rate", protect, rateBike);
router.get("/:id/ratings", getBikeRatings);

export default router;