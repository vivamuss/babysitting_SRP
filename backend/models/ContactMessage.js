const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
