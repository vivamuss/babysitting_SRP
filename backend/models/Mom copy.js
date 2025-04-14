const mongoose = require('mongoose');

const MomSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  children: [{
    name: String,
    age: Number,
    specialNeeds: String
  }],
  verification: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mom', MomSchema);