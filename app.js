const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Import cors package

// Initialize dotenv for environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all origins (or specify your frontend URL)
app.use(cors());

// Ensure 'uploads' folder exists, if not, create it
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up Multer storage configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  // Store uploaded files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename for each file
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type'), false); // Reject the file
    }
  }
});

// Export 'upload' for use in routes
module.exports.upload = upload;

// Import routes
const brandRoutes = require('./routes/brandRoutes');
const blogRoutes = require('./routes/blogRoutes');
const mobileRoutes = require('./routes/mobileRoutes');
const contactRoutes = require('./routes/contactRoutes');
const slideRoutes = require('./routes/slideRoutes');

// Use static folder to serve uploaded files (images)
app.use('/uploads', express.static(uploadsDir));

// Use routes for handling brands, blogs, mobile-related endpoints, and contact
app.use('/api/brands', brandRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/mobiles', mobileRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/slides', slideRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Test route to check if server is working
app.get('/', (req, res) => {
  res.send('Welcome to the Mobile App Backend!');
});

// Start the server
const PORT = process.env.PORT || 8000;  // Change to 8000 or use the one in .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
