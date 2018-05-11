const express = require('express');
const app = express();

app.get('/', function(req, res) {
	res.send('home');
});

// API routes
var login = require('./routes/login');
app.use('/api/login', login);

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});