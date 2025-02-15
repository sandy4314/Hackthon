const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ensure user reference
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending, accepted, rejected, completed
  priority: { type: String, required: true },  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
