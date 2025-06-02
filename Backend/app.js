require('dotenv').config();
const express = require('express');
const Routes = require('./routes/index');
const app = express();
const connectToDb = require('./db/db');

// For Connecting to the Database
connectToDb();

// Demo Route for Testing Backend
app.get('/', (req, res) => {
  res.send('Welcome to the Backend!');
});

app.use('/', Routes);

module.exports = app;
