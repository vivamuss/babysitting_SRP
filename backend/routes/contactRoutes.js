const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;
    const newMessage = new ContactMessage({ userId, message });
    await newMessage.save();
    res.status(201).json({ message: "Message received. We’ll get back to you soon!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;
