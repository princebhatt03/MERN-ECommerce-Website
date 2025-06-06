const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

function userController() {
  return {
    // User Registration Controller
    async registerUser(req, res) {
      const { fullName, username, email, mobile, password } = req.body;

      if (!fullName || !username || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          fullName,
          username,
          email,
          mobile,
          password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            mobile: newUser.mobile,
          },
        });
      } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // User Login Controller with JWT
    async loginUser(req, res) {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: 'Username and password are required.' });
      }

      try {
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
          },
        });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // Middleware - Protect Routes
    authenticateToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Access token required.' });
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
      });
    },

    // Logout Controller (client-side can just remove token)
    logoutUser(req, res) {
      return res.status(200).json({
        success: true,
        message: 'Logout successful (client must remove token manually).',
      });
    },

    // Updated User Controller with password confirmation
    async updateUserProfile(req, res) {
      const userId = req.user.id; // from decoded token
      const { currentPassword, updates } = req.body;

      try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // 1. Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ message: 'Incorrect current password' });
        }

        // 2. If password update is requested, hash it
        if (updates.password) {
          updates.password = await bcrypt.hash(updates.password, 10);
        }

        // 3. Apply updates safely
        Object.assign(user, updates);
        await user.save();

        // 4. Prepare payload for new JWT
        const updatedPayload = {
          id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
        };

        // 5. Sign and return new token
        const newToken = jwt.sign(updatedPayload, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        res.json({
          success: true,
          message: 'Profile updated successfully',
          token: newToken,
          user: updatedPayload,
        });
      } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // Delete User Controller
    async deleteUser(req, res) {
      const { id } = req.params;

      try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
          success: true,
          message: 'User deleted successfully',
          user: {
            id: deletedUser._id,
            username: deletedUser.username,
            email: deletedUser.email,
          },
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
}

module.exports = userController;
