const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    momName: { type: String, required: true },
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
