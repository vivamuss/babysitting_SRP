const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  available: Boolean,
  startTime: String,
  endTime: String,
});

const AvailabilitySchema = new mongoose.Schema({
  monday: DaySchema,
  tuesday: DaySchema,
  wednesday: DaySchema,
  thursday: DaySchema,
  friday: DaySchema,
  saturday: DaySchema,
  sunday: DaySchema,
});

module.exports = mongoose.model('Availability', AvailabilitySchema);
