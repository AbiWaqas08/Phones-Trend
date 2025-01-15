const mongoose = require('mongoose');

// Define the schema for contact data
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // To track the creation time
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
