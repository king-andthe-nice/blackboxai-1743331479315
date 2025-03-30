const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = {
  create: async (username, password, email) => {
    const passwordHash = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
        [username, passwordHash, email],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  verifyPassword: async (user, password) => {
    return await bcrypt.compare(password, user.password_hash);
  },

  generateToken: (user) => {
    return jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  },

  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  }
};

module.exports = User;