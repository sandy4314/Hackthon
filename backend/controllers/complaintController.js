const Complaint = require('../models/Complaint');

const User = require("../models/User");

const createComplaint = async (req, res) => {
  try {
    console.log("🔍 Incoming Complaint Request:", req.body);
    console.log("🔑 Decoded Token User:", req.user);

    const { issueType, description, priority } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing from token" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComplaint = new Complaint({
      userId: req.user.userId,
      issueType,
      description,
      priority,
    });

    await newComplaint.save();
    console.log("✅ Complaint Saved Successfully:", newComplaint);

    res.status(201).json({ message: "Complaint submitted successfully", complaint: newComplaint });
  } catch (error) {
    console.error("❌ Error submitting complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getComplaints = async (req, res) => {
  try {
    console.log("User making request:", req.user); // Debugging line

    const complaints = await Complaint.find({ userId: req.user.userId });
    console.log("Complaints found:", complaints); // Debugging line

    if (complaints.length === 0) {
      return res.status(200).json({ message: "No complaints found" });
    }

    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const updateComplaint = async (req, res) => {
  const { complaintId, status } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();
    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    console.log("📢 Fetching all complaints...");

    const complaints = await Complaint.find()
      .populate("userId", "username mobileNumber address") // Fetch user details
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!complaints || complaints.length === 0) {
      console.log("❌ No complaints found.");
      return res.status(404).json({ message: "No complaints found" });
    }

    console.log("✅ Complaints fetched successfully:", complaints);
    res.json(complaints);
  } catch (error) {
    console.error("❌ Error fetching complaints:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createComplaint, getComplaints, updateComplaint, getAllComplaints };
