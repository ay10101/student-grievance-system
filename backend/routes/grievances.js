const express = require("express");
const Grievance = require("../models/Grievance");
const protect = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/grievances/search?title=xyz
// @desc    Search grievances by title
// @access  Private
router.get("/search", async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Search title query is required" });
    }

    const grievances = await Grievance.find({
      student: req.user._id,
      title: { $regex: title, $options: "i" },
    }).sort({ date: -1 });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/grievances
// @desc    Submit a new grievance
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Validate input
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const grievance = await Grievance.create({
      title,
      description,
      category,
      student: req.user._id,
    });

    res.status(201).json(grievance);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/grievances
// @desc    Get all grievances for logged-in student
// @access  Private
router.get("/", async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.user._id }).sort({
      date: -1,
    });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/grievances/:id
// @desc    Get a single grievance by ID
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Ensure student owns this grievance
    if (grievance.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this grievance" });
    }

    res.json(grievance);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Grievance not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/grievances/:id
// @desc    Update a grievance
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Ensure student owns this grievance
    if (grievance.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this grievance" });
    }

    const { title, description, category, status } = req.body;

    // Update fields if provided
    if (title) grievance.title = title;
    if (description) grievance.description = description;
    if (category) grievance.category = category;
    if (status) grievance.status = status;

    const updatedGrievance = await grievance.save();
    res.json(updatedGrievance);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Grievance not found" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/grievances/:id
// @desc    Delete a grievance
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    // Ensure student owns this grievance
    if (grievance.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this grievance" });
    }

    await Grievance.findByIdAndDelete(req.params.id);
    res.json({ message: "Grievance deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Grievance not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
