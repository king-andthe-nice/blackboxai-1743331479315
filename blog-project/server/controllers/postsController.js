const Post = require('../models/post');

const PostsController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.findAll();
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getPostById: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  createPost: async (req, res) => {
    try {
      const { title, content, tags, featuredImage } = req.body;
      const postId = await Post.create(
        title, 
        content, 
        tags, 
        featuredImage, 
        req.user.id
      );
      res.status(201).json({ id: postId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { title, content, tags, featuredImage } = req.body;
      const changes = await Post.update(
        req.params.id,
        title,
        content,
        tags,
        featuredImage
      );
      if (changes === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  deletePost: async (req, res) => {
    try {
      const changes = await Post.delete(req.params.id);
      if (changes === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = PostsController;