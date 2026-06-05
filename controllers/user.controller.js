const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

class UserController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new UserController();
