const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')();
const isUserLoggedIn = require('../middlewares/user');

router.get('/', (req, res) => {
  res.render('index');
  console.log('Index page accessed');
});

// ******** USER POST ROUTES ********

// User Registration Route
router.post('/api/userRegister', userController.registerUser);

// User Login Route
router.post('/api/userLogin', userController.loginUser);

// User Update Route
router.patch('/api/userUpdate/:id', userController.updateUser);

// User Delete Route
router.delete('/api/userDelete/:id', userController.deleteUser);

module.exports = router;
