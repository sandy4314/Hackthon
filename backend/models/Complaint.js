const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, default: "pending" },
  imagePath: { type: String }, // ✅ Ensure this field exists
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
