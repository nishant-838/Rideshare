import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching reviews." });
  }
});

// POST a new review
router.post("/", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newReview = new Review({ name, rating, comment });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while saving review." });
  }
});

export default router;
