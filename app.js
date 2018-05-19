"use strict";

const express = require('express');
const app = express();

app.get('/', function(req, res) {
	res.send('home');
});

// API routes
var login = require('./routes/login');
app.use('/api/Login', login);

var createUser = require('./routes/create_user');
app.use('/api/CreateUser', createUser);

var userExists = require('./routes/user_exists');
app.use('/api/UserExists', userExists);

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});