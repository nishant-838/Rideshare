import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// 🔥 FIX: This special syntax imports and runs dotenv immediately BEFORE other imports hoist!
import "dotenv/config"; 

import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import fs from "fs";

// Now it is 100% safe to import your local routes
import authRoutes from "./routes/auth.js";
import bikeRoutes from "./routes/bikeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/Review.js";

console.log("🔍 Loaded Mongo URI:", process.env.MONGO_URI);
console.log("🔍 Loaded Cloudinary Name:", process.env.CLOUDINARY_CLOUD_NAME); 

const app = express();
app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL], 
    credentials: true,              
  })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.log("💥 FULL RAW ERROR OBJECT:", JSON.stringify(err, null, 2));
  console.error("💥 ERROR MESSAGE:", err.message || err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    rawError: err
  });
});