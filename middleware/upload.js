const multer = require('multer');
const path = require('path');

// Set storage options for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the folder to store the uploaded files
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname); // Get file extension
    const fileName = Date.now() + fileExtension; // Create a unique filename using current timestamp
    cb(null, fileName); // Save the file with the new name
  },
});

// Only allow certain file types (e.g., images)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type'), false); // Reject the file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
