const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ['mom', 'babysitter'] } // Add role for clarity
});

module.exports = mongoose.model('User', userSchema);
