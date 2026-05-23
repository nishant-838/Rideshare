import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();


//  Register (with file upload)
router.post(
  "/register",
  upload.fields([
    { name: "idCard", maxCount: 1 },
    { name: "license", maxCount: 1 },
  ]),
  register
);

// Login
router.post("/login", login);

//logout
router.post("/logout", protect, (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
