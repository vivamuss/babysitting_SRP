const mongoose = require('mongoose');

const PaymentTransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Completed'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PaymentTransaction', PaymentTransactionSchema);
