const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')();
const isUserLoggedIn = require('../middlewares/user');

// Home route
router.get('/', (req, res) => {
  res.render('index');
  console.log('Index page accessed');
});

// ******** USER POST ROUTES ********

// User Registration Route (public)
router.post('/api/userRegister', userController.registerUser);

// User Login Route (public)
router.post('/api/userLogin', userController.loginUser);

// User Update Route (protected, update by id param)
router.patch(
  '/api/userUpdate/:id',
  isUserLoggedIn,
  userController.updateUserProfile
);

// New protected route to update profile using token user ID
router.put(
  '/api/updateUserProfile',
  userController.authenticateToken, // Protect route, verifies JWT, sets req.user
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ message: 'User ID missing from token' });
      }
      req.params.id = userId;
      await userController.updateUserProfile(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// User Delete Route (protected)
router.delete('/api/userDelete/:id', isUserLoggedIn, userController.deleteUser);

module.exports = router;
