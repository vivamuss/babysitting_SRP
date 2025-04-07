const mongoose = require('mongoose');

const PaymentPreferenceSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PaymentPreference', PaymentPreferenceSchema);
