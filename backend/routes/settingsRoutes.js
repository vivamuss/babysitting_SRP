const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET user settings
router.get('/:userId', async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.params.userId });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error });
  }
});

// POST/UPDATE user settings
router.post('/:userId', async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true } // Create if not exists
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error });
  }
});

module.exports = router;
