const express = require('express');
const Contact = require('../models/contact'); // Correct model name 'contact'
const router = express.Router();

// CREATE a new contact form submission
// Simulate contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new contact entry
    const newContact = new Contact({
      name,
      email,
      message,
    });

    // Save the contact data to the database
    await newContact.save();

    // Send a success response
    res.status(200).json({ message: 'Message received successfully!' });
  } catch (err) {
    console.error('Error saving contact data:', err);
    res.status(500).json({ message: 'Failed to save message. Please try again later.' });
  }
});

// GET route to fetch all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find(); // Fetch all contacts from the database
    res.status(200).json(contacts); // Send the contacts as a response
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Failed to fetch contacts.' });
  }
});

// DELETE route to delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id); // Find and delete the contact by ID
    res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ message: 'Failed to delete contact.' });
  }
});


module.exports = router;
