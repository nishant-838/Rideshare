import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import authRoutes from "./routes/auth.js";
import bikeRoutes from "./routes/bikeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/Review.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.join(__dirname, ".env") });

console.log("🔍 Loaded Mongo URI:", process.env.MONGO_URI);

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,              
  })
);
app.use(express.json());


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));


app.use("/api", authRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
