const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Get all posts for the logged-in user
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { title, content } = req.body;
    
    // Check if uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating uploads directory...');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    console.log('Image URLs:', imageUrls);

    const post = new Post({
      title,
      content,
      images: imageUrls,
      author: req.user.userId
    });

    console.log('Saving post:', post);
    await post.save();
    console.log('Post saved successfully');
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Detailed error in createPost:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // If there's an error, delete any uploaded files
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ 
      message: 'Error creating post',
      error: error.message 
    });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const newImageUrls = req.files ? req.files.map(file => file.path) : [];

    const post = await Post.findOne({ _id: id, author: req.user.userId });
    
    if (!post) {
      // Delete any uploaded files if post not found
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        });
      }
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Delete old images if new ones are uploaded
    if (newImageUrls.length > 0) {
      post.images.forEach(oldImage => {
        fs.unlink(oldImage, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      });
      post.images = newImageUrls;
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    // Delete any uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findOne({ _id: id, author: req.user.userId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Delete associated images
    post.images.forEach(image => {
      fs.unlink(image, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    });

    await Post.deleteOne({ _id: id });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};

// Get a single post
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findOne({ 
      _id: id, 
      author: req.user.userId 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
}; 