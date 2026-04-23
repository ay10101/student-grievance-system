const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/register
// @desc    Register a new student
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create new student
    const student = await Student.create({ name, email, password });

    // Return student data with token
    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      token: generateToken(student._id),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/login
// @desc    Authenticate student & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return student data with token
    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      token: generateToken(student._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
