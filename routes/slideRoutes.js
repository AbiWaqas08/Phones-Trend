const express = require('express');
const multer = require('multer');
const path = require('path');
const Slide = require('../models/slide');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed file types
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png).'));
    }
  },
});

// Get all slides
router.get('/', async (req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1 });
    res.status(200).json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new slide
router.post('/', upload.single('image'), async (req, res) => {
  const slide = new Slide({
    title: req.body.title,
    description: req.body.description,
    image: req.file ? `/uploads/${req.file.filename}` : null, // Save the file path
    order: req.body.order || 0,
  });

  try {
    const newSlide = await slide.save();
    res.status(201).json(newSlide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a slide
router.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });

    if (req.body.title != null) slide.title = req.body.title;
    if (req.body.description != null) slide.description = req.body.description;
    if (req.file) slide.image = `/uploads/${req.file.filename}`;
    if (req.body.order != null) slide.order = req.body.order;

    const updatedSlide = await slide.save();
    res.status(200).json(updatedSlide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a slide
router.delete('/:id', async (req, res) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.status(200).json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
