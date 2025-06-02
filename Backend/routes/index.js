const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model');

router.get('/', (req, res) => {
  res.render('index');
  console.log('Index page accessed');
});

module.exports = router;
