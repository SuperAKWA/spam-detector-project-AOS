// models/Email.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  object: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    enum: ['spam', 'non-spam', 'phishing'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Email = mongoose.model('Email', emailSchema);
module.exports = Email;
