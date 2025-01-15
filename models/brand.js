const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true }, // Store the filename of the logo
});

module.exports = mongoose.model('Brand', BrandSchema);
