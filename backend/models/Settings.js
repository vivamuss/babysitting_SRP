const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  notificationsEnabled: { type: Boolean, default: false },
  profileVisibility: { type: String, default: 'public' },
  privacySettings: {
    isProfilePublic: { type: Boolean, default: false },
    allowMessagesFromStrangers: { type: Boolean, default: false },
  }
});

module.exports = mongoose.model('Settings', settingsSchema);
