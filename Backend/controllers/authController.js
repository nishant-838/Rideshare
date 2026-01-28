import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// 🔐 Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "7d",
  });
};

// 📝 Register Controller
export const register = asyncHandler(async (req, res) => {
  console.log("Incoming body:", req.body);
  console.log("Incoming files:", req.files);

  const { name, email, mobile, username, password, role } = req.body;

  // Ensure files are uploaded
  if (!req.files?.idCard || !req.files?.license) {
    return res.status(400).json({ message: "File upload missing" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const idCardPath = req.files.idCard[0].path;
  const licensePath = req.files.license[0].path;

  const user = await User.create({
    name,
    email,
    mobile,
    username,
    password,
    role,
    idCard: idCardPath,
    license: licensePath,
  });

  res.status(201).json({
    message: "✅ Registration successful!",
    token: generateToken(user._id),
    user,
  });
});

// 🔑 Login Controller
export const login = asyncHandler(async (req, res) => {
  const { email, password,role } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
   if (user.role !== role) {
    return res.status(403).json({
      message: `Access denied! You are registered as a ${user.role}.`,
    });
  }
  

  res.json({
    message: "✅ Login successful",
    token: generateToken(user._id), 
    user,
  });
});
