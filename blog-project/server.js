require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Database connection
const db = new sqlite3.Database('./server/db/database.sqlite', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      tags TEXT,
      featured_image TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

// Import controllers and middleware
const AuthController = require('./server/controllers/authController');
const PostsController = require('./server/controllers/postsController');
const authMiddleware = require('./server/middleware/authMiddleware');

// Public routes
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/register', AuthController.register);
app.get('/api/posts', PostsController.getAllPosts);
app.get('/api/posts/:id', PostsController.getPostById);

// Protected routes (require authentication)
app.use(authMiddleware.authenticate);

app.post('/api/posts', PostsController.createPost);
app.put('/api/posts/:id', PostsController.updatePost);
app.delete('/api/posts/:id', PostsController.deletePost);

// Serve static files from public directory
app.use(express.static('public'));

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});