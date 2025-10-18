// controllers/authController.js
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Admin Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;   // ✅ now using email

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// (Optional) Register Admin - only if you want programmatic creation
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const user = await User.create({ username, email, password, role: "admin" });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};
