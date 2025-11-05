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

// 🧩 Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from the same directory as server.js
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("🔍 Loaded Mongo URI:", process.env.MONGO_URI);

const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Your frontend URL
    credentials: true,               // ✅ Allow cookies / tokens
  })
);
app.use(express.json());


// 📁 Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

// 🛣️ API Routes
app.use("/api", authRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);

// 🌐 Connect MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

connectDB();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
