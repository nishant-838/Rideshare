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

// 🌐 SOCKET.IO INTEGRATION: Import native HTTP and Socket.io modules
import { createServer } from "http";
import { Server } from "socket.io";

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

// 🌐 SOCKET.IO INTEGRATION: Create the HTTP server wrapping our Express app
const httpServer = createServer(app);

// 🌐 SOCKET.IO INTEGRATION: Initialize Socket.io with dedicated CORS configuration
const io = new Server(httpServer, {
  path: "/socket.io/",
  cors: {
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  },
});

app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"], 
    credentials: true,              
  })
);
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

// server.js

// Middleware to authorize WebSockets using your existing JWT workflow
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    socket.userId = decoded.id; // Attach user/admin id to socket session
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`📱 Authenticated device connected: ${socket.id} (User: ${socket.userId})`);

  // Admins/Owners will join a specific room named after their unique User ID
  socket.on("join-dashboard", () => {
    socket.join(`owner-room-${socket.userId}`);
    console.log(`👤 Admin joined secure channel: owner-room-${socket.userId}`);
  });

  // Mobile phone transmits location data
  socket.on("send-location", async (data) => {
    const { bikeId, latitude, longitude } = data;

    try {
      // Find the bike to check who owns it
      const bike = await mongoose.model("Bike").findById(bikeId);
      if (!bike) return;

      const ownerTargetRoom = `owner-room-${bike.ownerId.toString()}`;

      // 🔥 Send the update ONLY to the specific room belonging to the bike's owner
      io.to(ownerTargetRoom).emit("ride-tracked", {
        bikeId,
        latitude,
        longitude,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error processing telemetry routing:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`📱 Device disconnected: ${socket.id}`);
  });
});

connectDB();

const PORT = process.env.PORT || 5009;

// 🌐 SOCKET.IO INTEGRATION: Changed from app.listen to httpServer.listen
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.use((err, req, res, next) => {
  console.log("💥 FULL RAW ERROR OBJECT:", JSON.stringify(err, null, 2));
  console.error("💥 ERROR MESSAGE:", err.message || err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    rawError: err
  });
});