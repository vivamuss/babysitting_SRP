const mongoose = require('mongoose');

const healthOverviewSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Date of the health entry
  weight: { type: Number },
  height: { type: Number },
  temperature: { type: Number, min: 28, max: 50 },
});

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Date, required: true },
  healthoverview: { type: [healthOverviewSchema], default: [] },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  child: childSchema,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role:"mom",
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    dist: { type: String },
    state: { type: String },
    country: { type: String },
  },
  profile_picture: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
