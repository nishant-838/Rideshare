import express from "express";
import multer from "multer";
import path from "path";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Multer setup
const uploadDir = path.join(process.cwd(), "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

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
