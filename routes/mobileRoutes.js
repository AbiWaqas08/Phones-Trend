const express = require('express');
const router = express.Router();
const Mobile = require('../models/mobile');
const upload = require('../middleware/upload'); // Corrected import for multer middleware

// CREATE a new Mobile
router.post('/', upload.single('image'), async (req, res) => {
  const {
    brand,
    model,
    releaseYear,
    price,
    build,
    frequency,
    processor,
    display,
    memory,
    camera,
    connectivity,
    battery,
    features,
    description,
  } = req.body;

  // Create a new mobile instance
  const newMobile = new Mobile({
    brand,
    model,
    releaseYear,
    price,
    build,
    frequency,
    processor,
    display,
    memory,
    camera,
    connectivity,
    battery,
    features,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null, // If image is uploaded, use its path
    description,
  });

  try {
    const savedMobile = await newMobile.save();
    res.status(201).json(savedMobile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ all Mobiles
router.get('/', async (req, res) => {
  try {
    const mobiles = await Mobile.find();
    res.json(mobiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ a single Mobile by ID
router.get('/:id', async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });
    res.json(mobile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a Mobile by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });

    // Update mobile fields with new data (if provided)
    mobile.brand = req.body.brand || mobile.brand;
    mobile.model = req.body.model || mobile.model;
    mobile.releaseYear = req.body.releaseYear || mobile.releaseYear;
    mobile.price = req.body.price || mobile.price;
    mobile.build = req.body.build || mobile.build;
    mobile.frequency = req.body.frequency || mobile.frequency;
    mobile.processor = req.body.processor || mobile.processor;
    mobile.display = req.body.display || mobile.display;
    mobile.memory = req.body.memory || mobile.memory;
    mobile.camera = req.body.camera || mobile.camera;
    mobile.connectivity = req.body.connectivity || mobile.connectivity;
    mobile.battery = req.body.battery || mobile.battery;
    mobile.features = req.body.features || mobile.features;
    mobile.description = req.body.description || mobile.description;

    // Update image if a new one is uploaded
    if (req.file) {
      mobile.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedMobile = await mobile.save();
    res.json(updatedMobile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a Mobile by ID
router.delete('/:id', async (req, res) => {
  try {
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({ message: 'Mobile not found' });

    await mobile.remove();
    res.status(200).json({ message: 'Mobile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
