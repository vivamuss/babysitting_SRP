const mongoose = require('mongoose');

const BabysitterSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  fare: { type: Number, required: true },
  role: String,
  phone: String,
  address: {
    street: String,
    city: String,
    dist: String,
    state: String,
    country: String
  },
  profile_picture: String,
  rating: { type: String, default: "0" },
  created_at: { type: Date, default: Date.now },
  verification: { type: Boolean, default: false }
});

module.exports = mongoose.model('Babysitter', BabysitterSchema);
