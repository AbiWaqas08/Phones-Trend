const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true }, // Store the path or URL for the slide image
  order: { type: Number, default: 0 }, // Optional for sorting slides
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Slide', slideSchema);
