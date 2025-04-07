const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

// Get babysitter earnings
router.get('/:babysitterId/earnings', async (req, res) => {
    try {
        const { babysitterId } = req.params;
        const bookings = await Booking.find({ babysitterId });

        // Calculate total earnings (assuming each booking has a `price` field)
        const totalEarnings = bookings.reduce((sum, booking) => sum + booking.price, 0);

        res.json({ earnings: totalEarnings });
    } catch (error) {
        console.error("Error fetching earnings:", error);
        res.status(500).json({ error: "Error fetching earnings" });
    }
});

// Get payment reports
router.get('/:babysitterId/payment-reports', async (req, res) => {
    try {
        const { babysitterId } = req.params;
        const babysitter = await User.findById(babysitterId);

        if (!babysitter) {
            return res.status(404).json({ error: "Babysitter not found" });
        }

        res.json({ transactions: babysitter.paymentReports || [] });
    } catch (error) {
        console.error("Error fetching payment reports:", error);
        res.status(500).json({ error: "Error fetching payment reports" });
    }
});

module.exports = router;
