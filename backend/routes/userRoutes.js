const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validateUser } = require('../middleware/validation');

// Get all users (for admin purposes)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// Create new user (registration)
router.post('/', validateUser, async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || 'parent' // Default to 'parent' if not specified
    });

    const newUser = await user.save();
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user
router.patch('/:id', getUser, validateUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.phone != null) {
    res.user.phone = req.body.phone;
  }
  if (req.body.password != null) {
    res.user.password = await bcrypt.hash(req.body.password, 10);
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;