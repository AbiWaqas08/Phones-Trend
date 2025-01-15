const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand'); // Brand model
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save uploaded files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed.'));
    }
  }
});

// 1. GET all brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find(); // Get all brands from the database
    res.status(200).json(brands);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch brands', error: err });
  }
});

// 2. GET a single brand by ID
router.get('/:id', async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id); // Get brand by ID
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch brand', error: err });
  }
});

// 3. POST (Create) a new brand
// POST route to add a new brand
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { name } = req.body;
    const logo = req.file.filename; // Get the uploaded logo filename

    // Create and save new brand
    const newBrand = new Brand({ name, logo });
    await newBrand.save();

    res.status(201).json(newBrand);
  } catch (err) {
    console.error('Error adding brand:', err);
    res.status(500).json({ message: 'Failed to add brand', error: err });
  }
});

// 4. PUT (Update) a brand by ID
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const updates = { name: req.body.name };
    if (req.file) {
      updates.logo = req.file.filename;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json(updatedBrand);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update brand', error: err });
  }
});

// 5. DELETE a brand by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete brand', error: err });
  }
});

module.exports = router;
