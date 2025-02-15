const Complaint = require('../models/Complaint');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');  // Import JWT
// Load environment variables
dotenv.config();

// Admin login handler
const adminLogin = async (req, res) => {
  const { username, password } = req.body; // Expect 'username' instead of 'email'

  console.log("Admin Login Attempt:", username, password);
  console.log("Loaded Admin Credentials:", process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful", token });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

const getAllComplaints = async (req, res) => {
  try {
    console.log("📢 Fetching all complaints for admin...");

    const complaints = await Complaint.find()
      .populate("userId", "username mobileNumber address") // Fetch user details
      .sort({ createdAt: -1 });

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



// Admin can update complaint status
const updateComplaintStatus = async (req, res) => {
  const { complaintId, status } = req.body;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    await complaint.save();

    // If status is 'accepted' or 'completed', send email to the user
    if (status === 'accepted' || status === 'completed') {
      const user = await User.findById(complaint.userId);
      if (user) {
        sendEmail(user.email, status);  // Send email function
      }
    }

    res.status(200).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send email notification to user
const sendEmail = (userEmail, status) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Complaint Status Update: ${status}`,
    text: `Your complaint status has been updated to: ${status}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { adminLogin, getAllComplaints, updateComplaintStatus };
