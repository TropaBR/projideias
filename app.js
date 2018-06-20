"use strict";

const express = require('express');
const app = express();

// Static files
app.use(express.static('static_content'));

// views settings
app.set('views', './views');
app.set('view engine', 'ejs');

// View routes
app.all('/:view?', function(req, res) {
  var page = req.params.view || 'index';
	res.render(page);
});

// API routes
var login = require('./api/login');
app.use('/api/Auth', login);

var createUser = require('./api/create_user');
app.use('/api/CreateUser', createUser);

var userExists = require('./api/user_exists');
app.use('/api/UserExists', userExists);

var login = require('./api/get_ideas');
app.use('/api/GetIdeas', login);

var createIdea = require('./api/create_idea');
app.use('/api/CreateIdea', createIdea);

// Error page
app.use(function(req, res, next) {
  res.status(404);
  res.render('error');
});

// Error page
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500);
  res.render('error');
});

// Start the server
const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});