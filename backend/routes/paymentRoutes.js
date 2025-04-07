const express = require('express');
const router = express.Router();

const PaymentPreference = require('../models/PaymentPreference');
const PaymentTransaction = require('../models/PaymentTransaction');

// Save payment preferences
router.post('/payment-preferences', async (req, res) => {
    try {
        const { method, rate } = req.body;
        const preference = new PaymentPreference({ method, rate });
        await preference.save();
        res.status(201).json({ message: 'Payment preferences saved' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save payment preferences' });
    }
});

// Process payment
router.post('/process-payment', async (req, res) => {
    try {
        const { amount, method } = req.body;
        const transaction = new PaymentTransaction({ amount, method });
        await transaction.save();
        res.status(201).json({ message: 'Payment processed' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

// Get all payment reports
router.get('/payment-reports', async (req, res) => {
    try {
        const transactions = await PaymentTransaction.find().sort({ date: -1 });
        res.json({ transactions });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payment reports' });
    }
});

module.exports = router;
