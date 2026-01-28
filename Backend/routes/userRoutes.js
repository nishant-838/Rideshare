import express from "express";
import { protect } from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

// GET /api/users/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
