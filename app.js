"use strict";

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const ckParser = require('cookie-parser');

// Static files
app.use(express.static('static_content'));

// views settings
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(ckParser());

function TokenCheck(req, res, next) {
  jwt.verify(req.cookies.token, 'PRIVATE_KEY', function(err, decoded) {
    if(err) {
      console.log(err);
      res.render('unlogged_index');
      return;
    } else {
      res.locals.user = decoded;
      next();
    }
  });
}

// Public API routes
var login = require('./api/login');
app.use('/api/Auth', login);

var user = require('./api/user');
app.use('/api/', user);

var UserExists = require('./api/user_exists');
app.use('/api/UserExists', UserExists);

// Public view routes
app.all('/login', function(req, res) {
	res.render('login');
});

app.all('/register', function(req, res) {
	res.render('register');
});

// Logged-in content past this line
app.use(TokenCheck);

app.all('/logout', function(req, res) {
  res.clearCookie("token");
	res.redirect('/');
});

// Logged-in view routes
app.all('/:view?', function(req, res) {
  var page = req.params.view || 'index';

  var pageData = {
    user : res.locals.user
  }

	res.render(page, pageData);
});

// Logged-in API routes
var getIdeas = require('./api/get_ideas');
app.use('/api/GetIdeas', getIdeas);

var createIdea = require('./api/create_idea');
app.use('/api/CreateIdea', createIdea);

var project = require('./api/project');
app.use('/api/', project);

var idea = require('./api/idea');
app.use('/api/', idea);

var getUsers = require('./api/get_users');
app.use('/api/GetUsersByName', getUsers);

var getRecentProjects = require('./api/get_recent_projects');
app.use('/api/GetRecentProjects', getRecentProjects);

var invite = require('./api/invite');
app.use('/api/', invite);

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