import express from "express";

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

// OWNER ONLY
router.post("/", protect, ownerOnly, addBike);

// PUBLIC
router.get("/", getAllBikes);

router.get("/available", getAvailableBikes);

router.get("/:id", getBikeById);

// OWNER ONLY
router.put("/:id", protect, ownerOnly, updateBike);

router.delete("/:id", protect, ownerOnly, deleteBike);

// AUTH REQUIRED
router.post("/:id/rate", protect, rateBike);

router.get("/:id/ratings", getBikeRatings);

export default router;