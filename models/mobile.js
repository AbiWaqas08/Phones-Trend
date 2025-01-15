const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  price: { type: Number, required: true },
  build: {
    os: { type: String, required: true },
    ui: { type: String, required: true },
    dimensions: { type: String, required: true },
    weight: { type: String, required: true },
    sim: { type: String, required: true },
    colors: { type: [String], required: true },
  },
  frequency: {
    '2G': { type: String },
    '3G': { type: String },
    '4G': { type: String },
    '5G': { type: String },
  },
  processor: {
    cpu: { type: String, required: true },
    gpu: { type: String, required: true },
    chipset: { type: String, required: true },
  },
  display: {
    technology: { type: String, required: true },
    size: { type: String, required: true },
    resolution: { type: String, required: true },
    protection: { type: String },
    extraFeatures: { type: [String] },
  },
  memory: {
    ram: { type: Number, required: true }, // Added RAM field (in GB)
    builtIn: { type: String, required: true },
    card: { type: String },
  },
  camera: {
    main: { type: String, required: true },
    features: { type: [String] },
    front: { type: String, required: true },
  },
  connectivity: {
    wlan: { type: [String] },
    bluetooth: { type: String },
    nfc: { type: String },
    gps: { type: String },
    usb: { type: String },
    infrared: { type: String },
  },
  battery: {
    capacity: { type: String, required: true },
  },
  features: {
    sensor: { type: [String] },
    touch: { type: String },
    games: { type: String },
    extra: { type: [String] },
    browser: { type: String },
    messaging: { type: [String] },
  },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Mobile = mongoose.model('Mobile', mobileSchema);
module.exports = Mobile;
