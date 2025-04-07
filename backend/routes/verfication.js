const express = require('express');
const multer = require('multer');
const path = require('path');
const Babysitter = require('../models/Babysitter');
const router = express.Router();

// Setup multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname); // optionally rename
  },
});
const upload = multer({ storage });

// Upload documents
router.post('/upload', upload.fields([
  { name: 'babysitting' },
  { name: 'firstAid' },
  { name: 'anaphylaxis' },
  { name: 'otherDocuments' },
]), async (req, res) => {
  const { email } = req.body;
  const files = req.files;

  if (!email || !files.babysitting || !files.firstAid || !files.anaphylaxis) {
    return res.status(400).json({ error: 'Required files missing.' });
  }

  try {
    const updated = await Babysitter.findOneAndUpdate(
      { email },
      {
        email,
        documents: {
          babysitting: files.babysitting[0].filename,
          firstAid: files.firstAid[0].filename,
          anaphylaxis: files.anaphylaxis[0].filename,
          otherDocuments: files.otherDocuments ? files.otherDocuments[0].filename : null,
        },
        verified: true,
      },
      { upsert: true, new: true }
    );

    res.json({ message: 'Uploaded successfully!', verified: true });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check verification
router.get('/check-verification', async (req, res) => {
  const { email } = req.query;
  try {
    const babysitter = await Babysitter.findOne({ email });
    if (!babysitter) return res.json({ verified: false });
    res.json({ verified: babysitter.verified });
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
