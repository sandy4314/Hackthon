const express = require('express');
const router = express.Router();
const { getAllComplaints, updateComplaintStatus } = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const authorizeAdmin = require('../middleware/authorizeAdmin'); // Custom middleware for checking admin

// Admin routes
router.get('/dashboard', authenticate, authorizeAdmin, getAllComplaints);
router.post('/update-status', authenticate, authorizeAdmin, updateComplaintStatus);

module.exports = router;

