const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    momId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    babysitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    familyName: { type: String, required: true },
    numberOfChildren: { type: Number, required: true },
    address: { type: String, required: true },
    specialInstructions: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'completed'], default: 'pending' },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

