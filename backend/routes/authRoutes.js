const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User"); // Ensure you have a User model


// User Signup
router.post("/signup", async (req, res) => {
    const { username, email, password, mobileNumber, address } = req.body;
  
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email already exists
      let emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      user = new User({
        username,
        email,  // Storing email
        password: hashedPassword,
        mobileNumber,
        address,
      });
  
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
});

// User Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if it's an admin login
  if (username === process.env.REACT_APP_ADMIN_USERNAME && password === process.env.REACT_APP_ADMIN_PASSWORD) {
    // Generate admin token
    const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token, role: "admin" });
  }

  try {
    // Check if user exists in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate user token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,  // Include email in JWT
        role: "user",
        mobileNumber: user.mobileNumber, // Include mobile number
        address: user.address, // Include address
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      token, 
      role: "user", 
      email: user.email,  // Sending email in response
      mobileNumber: user.mobileNumber, 
      address: user.address 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
