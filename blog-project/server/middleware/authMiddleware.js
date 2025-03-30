const User = require('../models/user');

const authMiddleware = {
  authenticate: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = User.verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },

  isAdmin: (req, res, next) => {
    // In a real app, you would check if the user has admin privileges
    // For this demo, we'll assume all authenticated users are admins
    next();
  }
};

module.exports = authMiddleware;