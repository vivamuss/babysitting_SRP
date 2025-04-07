const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

const router = express.Router();

// Create a booking request
// Create a booking request
router.post('/book', async (req, res) => {
  try {
      console.log('Incoming booking request:', req.body); // Log the incoming request
      
      let { momId, babysitterId, date, time, familyName, numberOfChildren, address, specialInstructions } = req.body;

      // Validate all required fields
      if (!momId || !babysitterId || !date || !time || !familyName || !numberOfChildren || !address) {
          console.error('Missing required fields');
          return res.status(400).json({ 
              message: 'All fields are required',
              receivedData: req.body
          });
      }

      // Convert IDs to ObjectId
      if (!mongoose.Types.ObjectId.isValid(momId) || !mongoose.Types.ObjectId.isValid(babysitterId)) {
          return res.status(400).json({ message: 'Invalid momId or babysitterId' });
      }

      momId = new mongoose.Types.ObjectId(momId);
      babysitterId = new mongoose.Types.ObjectId(babysitterId);

      const booking = new Booking({ 
          momId, 
          babysitterId, 
          date, 
          time, 
          familyName,
          numberOfChildren: parseInt(numberOfChildren),
          address,
          specialInstructions: specialInstructions || '',
          status: 'pending' 
      });

      console.log('Creating booking:', booking);
      await booking.save();
      
      res.status(201).json({ message: 'Booking request sent', booking });
  } catch (err) {
      console.error('Booking Error:', err);
      res.status(500).json({ 
          message: 'Internal Server Error',
          error: err.message,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
  }
});

// Add rating and review
router.post('/rate/:id', async (req, res) => {
  try {
      const { rating, review } = req.body;
      const bookingId = req.params.id;

      if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ message: 'Valid rating (1-5) is required' });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      booking.rating = rating;
      booking.review = review;
      booking.status = 'completed';
      await booking.save();

      res.json({ message: 'Rating submitted successfully', booking });
  } catch (err) {
      console.error('Rating Error:', err);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Get all bookings for a babysitter
router.get('/babysitter/:id', async (req, res) => {
  try {
      console.log("Fetching bookings for babysitter:", req.params.id);

      const babysitterId = new mongoose.Types.ObjectId(req.params.id); // ✅ Convert ID to ObjectId
      const bookings = await Booking.find({ babysitterId }).populate('momId');

      console.log("Found bookings:", bookings);
      res.json(bookings);
  } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ message: err.message });
  }
});
// Accept or reject a booking
router.put('/update/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }

        if (!['pending', 'confirmed', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Allowed values: pending, confirmed, rejected' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status;
        await booking.save();
        res.json({ message: `Booking ${status}`, booking });
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

module.exports = router;
