const express = require('express');
const Blog = require('../models/blog');
const upload = require('../app').upload; // Import multer for image upload
const router = express.Router();

// CREATE a new Blog
router.post('/', upload.single('image'), async (req, res) => {
  const {
    title,
    metaDescription,
    content,
    tags,
    slug,
    author,
    uploadDate,
  } = req.body;

  // Create a new blog instance
  const newBlog = new Blog({
    title,
    metaDescription,
    content,
    tags,
    slug,
    author,
    uploadDate,
    image: req.file ? `/uploads/${req.file.filename}` : null, // If image is uploaded, use its path
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ all Blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ a single Blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read a blog by slug
// Read a single Blog by title (not recommended for non-unique values)
router.get('/title/:title', async (req, res) => {
  try {
    const blog = await Blog.findOne({ title: req.params.title });  // Find by title instead of slug or id
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);  // Send the blog data back as JSON
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});



// UPDATE a Blog by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Update blog fields with new data (if provided)
    blog.title = req.body.title || blog.title;
    blog.metaDescription = req.body.metaDescription || blog.metaDescription;
    blog.content = req.body.content || blog.content;
    blog.tags = req.body.tags || blog.tags;
    blog.slug = req.body.slug || blog.slug;
    blog.author = req.body.author || blog.author;
    blog.uploadDate = req.body.uploadDate || blog.uploadDate;

    // Update image if a new one is uploaded
    if (req.file) {
      blog.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a Blog by ID
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await blog.remove();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
