require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const momRoutes = require('./routes/momRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const babysitterRoutes = require('./routes/babysitterRoutes');
const adminRoutes = require('./routes/admin');


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/mom',momRoutes);
app.use('/upload', uploadRoutes);
app.use('/babysitters', babysitterRoutes);
app.use('/admin', adminRoutes);

// Start Server
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💾 MongoDB running on ${MONGO_URI}`);
});