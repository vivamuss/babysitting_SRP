const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// Get availability (for now, assume there's only one for simplicity)
router.get('/', async (req, res) => {
  try {
    const availability = await Availability.findOne(); 
    res.json(availability || {});
  } catch (error) {
    console.error('GET availability error:', error);
    res.status(500).send('Server error');
  }
});

// Save or update availability
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    let availability = await Availability.findOne();
    if (availability) {
      availability.set(data);
      await availability.save();
    } else {
      availability = new Availability(data);
      await availability.save();
    }
    res.status(200).json({ message: 'Availability saved' });
  } catch (error) {
    console.error('POST availability error:', error);
    res.status(500).send('Error saving availability');
  }
});

module.exports = router;
