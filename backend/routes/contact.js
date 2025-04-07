const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// POST: Submit a contact message
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const newMsg = new ContactMessage({ userId, message });
    await newMsg.save();
    res.json({ message: "Message sent to admin successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
