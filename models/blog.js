const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  metaDescription: String,
  content: String,
  tags: String,
  slug: { type: String, required: true, unique: true },
  author: String,
  uploadDate: { type: Date, default: Date.now },
  image: String,
});

// Ensure index for the slug field
blogSchema.index({ slug: 1 }, { unique: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
;

