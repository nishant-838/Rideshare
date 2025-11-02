import express from "express";
import { addBike, getAllBikes,  getAvailableBikes,getBikeById } from "../controllers/bikeController.js";

const router = express.Router();

// 🏍️ Add new bike (only for owners)
router.post("/", addBike);

// 🔍 Get all available bikes (for renters to view)
router.get("/", getAllBikes);

router.get("/available", getAvailableBikes);

router.get("/:id", getBikeById);


export default router;
