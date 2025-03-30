const db = require('../db/db');

const Post = {
  create: (title, content, tags, featuredImage, userId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO posts (title, content, tags, featured_image, user_id) VALUES (?, ?, ?, ?, ?)',
        [title, content, JSON.stringify(tags), featuredImage, userId],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT p.*, u.username as author FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT p.*, u.username as author FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  update: (id, title, content, tags, featuredImage) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE posts SET title = ?, content = ?, tags = ?, featured_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [title, content, JSON.stringify(tags), featuredImage, id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM posts WHERE id = ?',
        [id],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }
};

module.exports = Post;