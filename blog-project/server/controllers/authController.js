const User = require('../models/user');

const AuthController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(username);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await User.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = User.generateToken(user);
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const userId = await User.create(username, password, email);
      res.status(201).json({ id: userId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = AuthController;