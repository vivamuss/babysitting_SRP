const mongoose = require('mongoose');

const healthOverviewSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  weight: { type: Number },
  height: { type: Number },
  temperature: { type: Number, min: 28, max: 50 },
}, { _id: false });

const childSchema = new mongoose.Schema({
  name: String,
  age: { type: Date},
  healthoverview: { type: [healthOverviewSchema], default: [] },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  child: childSchema,
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

module.exports = mongoose.model('Mom', userSchema);