
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Booking = require('./models/Booking');
const User = require('./models/User');  // ✅ Ensure this is imported!
const uploadRoutes = require('./routes/upload'); // or adjust path if it's elsewhere
const contactRoutes = require("./routes/contactRoutes");


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/bookingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected...");
}).catch(err => console.error("MongoDB Connection Error:", err));

app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api/contactMessage', require('./routes/contactRoutes'));
app.use('/uploads', express.static('uploads')); 
app.use('/api/contact', contactRoutes);

app.use('/api/reviews', require('./routes/reviews'));


app.listen(5000, () => console.log("Server running on port 5000"));

app.get('/api/bookings/:babysitterId', async (req, res) => {
    const { babysitterId } = req.params;
    try {
        const bookings = await Booking.find({ babysitterId }); // Assuming Booking is your model
        res.json(bookings);  // Send the bookings data as a JSON response
    } catch (error) {
        res.status(500).send('Error fetching bookings');
    }
});