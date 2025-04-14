const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mom = require('../models/Mom');
const Babysitter = require('../models/Babysitter');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    // Determine which model to use based on userType
    const Model = userType === 'mom' ? Mom : Babysitter;
    const user = await Model.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    
    res.json({ token, userType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registration route
router.post('/register/:userType', async (req, res) => {
  try {
    const { userType } = req.params;
    const userData = req.body;
    
    if (!userData.email || !userData.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existingUser = await (userType === 'mom' ? Mom : Babysitter).findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    
    // Create new user based on type
    let newUser;
    if (userType === 'mom') {
      newUser = new Mom({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        child: {
          name: userData.childName,
          age: userData.childDOB,
          healthoverview: []
        },
        address: {
          street: userData.street,
          city: userData.city,
          dist: userData.dist,
          state: userData.state,
          country: userData.country
        },
        profile_picture: userData.profile_picture,
      });
    } else if (userType === 'babysitter') {
      newUser = new Babysitter({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        fare: userData.fare,
        role: "babysitter",
        address: {
          street: userData.street,
          city: userData.city,
          dist: userData.dist,
          state: userData.state,
          country: userData.country
        },
        phone: userData.phone,
        verification: false
      });
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
