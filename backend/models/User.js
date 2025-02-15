const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true }, // New field
  address: { type: String, required: true }, // New field
  isAdmin: { type: Boolean, default: false }, // Add isAdmin field
});

module.exports = mongoose.model('User', UserSchema);
