const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const { ApplicationError } = require('../middleware/error.middleware.js');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

class UserController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        throw new ApplicationError("Missing required fields", 400);
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApplicationError("Email already in use", 409);
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
      throw new ApplicationError(error.message || 'Server error during registration', 500);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApplicationError("Missing required fields", 400);
      }

      const user = await User.findOne({ email });
      if (!user) {
        throw new ApplicationError("Invalid email or password", 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApplicationError("Invalid email or password", 401);
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000,
      });

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
      throw new ApplicationError(error.message || 'Server error during login', 500);
    }
  }
}

module.exports = new UserController();
