const User = require('../models/user.model');
const bcrypt = require('bcrypt');

function userController() {
  return {
    // ********** USER's POST ROUTES CONTROLLERS **********

    // ✅ User Registration Controller
    async registerUser(req, res) {
      const { fullName, username, email, mobile, password } = req.body;

      // Basic validation
      if (!fullName || !username || !email || !mobile || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        // ✅ Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ message: 'Username already exists.' });
        }

        // ✅ Hash the password securely with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create a new User instance
        const newUser = new User({
          fullName,
          username,
          email,
          mobile,
          password: hashedPassword,
        });

        // ✅ Save the new user to the database
        await newUser.save();

        // ✅ Send a clean response to frontend or Postman
        return res.status(201).json({
          success: true,
          message: 'User registered successfully',

          // Frontend can use this data for localStorage or UI display
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            mobile: newUser.mobile,
          },

          // Optional: In future, generate and send a token for auto-login
          // token: "JWT_TOKEN_HERE"
        });

        /*
         If you're integrating with React:
         - You can redirect on frontend after `success === true`
         - Example:
           if (res.data.success) {
             navigate("/login"); // In React Router
           }
         */
      } catch (error) {
        console.error('Error registering user:', error);

        return res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message,
        });
      }
    },

    // ✅ User Login Controller
    async loginUser(req, res) {
      const { username, password } = req.body;

      // ✅ Input validation
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: 'Username and password are required.' });
      }

      try {
        // ✅ Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }

        // ✅ Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // ✅ If valid, send response (JWT can be added later here)
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
          },
          // 🔐 token: "JWT_TOKEN_HERE" // Add this in future for authentication
        });

        /*
            🔄 React Frontend Use Case:
            if (res.data.success) {
              // Save user info/token in localStorage
              localStorage.setItem('user', JSON.stringify(res.data.user));
              // Redirect to dashboard/home
              navigate('/dashboard');
            }
          */
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // ✅ Update User Controller (PATCH)
    async updateUser(req, res) {
      const { id } = req.params;
      const { fullName, username, email, mobile, password } = req.body;

      try {
        // ✅ Find user by ID
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // ✅ Update only provided fields
        if (fullName) user.fullName = fullName;
        if (username) user.username = username;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;

        // ✅ If password is provided, hash it before saving
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }

        // ✅ Update the timestamp
        user.updatedAt = new Date();

        // ✅ Save the updated user
        const updatedUser = await user.save();

        return res.status(200).json({
          success: true,
          message: 'User updated successfully',
          user: {
            id: updatedUser._id,
            username: updatedUser.username,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            updatedAt: updatedUser.updatedAt,
          },
        });

        /*
            🔄 React Frontend Use Case:
            const response = await axios.patch(`/api/users/update/${userId}`, updatedFields);
            if (response.data.success) {
              alert("Profile Updated");
              navigate('/profile');
            }
          */
      } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },

    // ✅ Delete User Controller
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

        /*
            🔄 React Frontend Use Case:
            const res = await axios.delete(`/api/users/delete/${userId}`);
            if (res.data.success) {
              alert("Account deleted");
              navigate('/register');
            }
          */
      } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    },
  };
}

module.exports = userController;
