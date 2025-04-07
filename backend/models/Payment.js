const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    method: { type: String, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
