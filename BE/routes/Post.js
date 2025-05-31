const express = require('express');
const router = express.Router();
const { 
  getUserPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  getPost 
} = require('../Controllers/PostController');
const auth = require('../middleware/auth');
const upload = require('../Config/multer');

// All routes are protected with auth middleware
router.use(auth);

// Get all posts for the logged-in user
router.get('/', getUserPosts);

// Get a single post
router.get('/:id', getPost);

// Create a new post with multiple image uploads
router.post('/', upload, createPost);

// Update a post with multiple image uploads
router.put('/:id', upload, updatePost);

// Delete a post
router.delete('/:id', deletePost);

module.exports = router; 