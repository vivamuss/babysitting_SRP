const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // You can customize this more
  }
});

const upload = multer({ storage });

router.post('/upload', upload.fields([
  { name: 'babysitting', maxCount: 1 },
  { name: 'firstAid', maxCount: 1 },
  { name: 'anaphylaxis', maxCount: 1 },
  { name: 'otherDocuments', maxCount: 1 },
]), async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Uploaded by:', email);
    console.log('Files:', req.files);

    if (!req.files || !req.body.email) {
      return res.status(400).json({ error: 'Missing files or email' });
    }

    // Save verification info to DB here (optional)
    // You could mark user as "verified" or store file paths

    res.status(200).json({ message: 'Upload successful', files: req.files });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

module.exports = router;
