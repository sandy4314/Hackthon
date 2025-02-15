const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin');

const {
  createComplaint,
  getComplaints,
  updateComplaint,
  getAllComplaints, // Admin-specific route
} = require('../controllers/complaintController');

// Route for regular users to create complaints
router.post('/', authenticate, createComplaint); // Create a new complaint

// Route for regular users to get their own complaints
router.get('/', authenticate, getComplaints); // Get complaints for a user

// Admin route to get all complaints from all users
router.get('/admin', authenticate, authorizeAdmin, getAllComplaints); // Admin route to get all complaints

// Route to update a complaint status (available to both user and admin)
router.put('/', authenticate, updateComplaint); // Update complaint status

module.exports = router;

