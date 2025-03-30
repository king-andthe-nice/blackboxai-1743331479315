const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at', DB_PATH);
  }
});

// Enable foreign key constraints
db.run('PRAGMA foreign_keys = ON', (err) => {
  if (err) console.error('Failed to enable foreign keys:', err);
});

module.exports = db;