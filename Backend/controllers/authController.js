import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import validator from "validator";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const { name, email, mobile, username, password, role } = req.body;

  // VALIDATION
  if (!name || !email || !mobile || !username || !password || !role) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Invalid email",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  // FILE VALIDATION
  if (!req.files?.idCard || !req.files?.license) {
    return res.status(400).json({
      message: "Required files missing",
    });
  }

  // EXISTING USER CHECK
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // DEBUG LOGS
  console.log("FILES:", req.files);
  console.log("IDCARD:", req.files?.idCard);
  console.log("LICENSE:", req.files?.license);

  // CREATE USER
  const user = await User.create({
    name,
    email,
    mobile,
    username,
    password, // Note: Make sure your User model has a pre-save hook to hash this!
    role,
    idCard: req.files?.idCard?.[0]?.path || req.files?.idCard?.[0]?.secure_url,
    license: req.files?.license?.[0]?.path || req.files?.license?.[0]?.secure_url,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token: generateToken(user._id),
    user,
  });
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({
      message: "All fields required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  if (user.role !== role) {
    return res.status(403).json({
      message: `Access denied! Registered as ${user.role}`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: generateToken(user._id),
    user,
  });
});