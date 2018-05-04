const express = require('express')
const app = express()

app.get('/', function(req, res) {
	res.send('home')
})

// Request routes
var login = require('./routes/login')
app.use('/login', login)

app.listen(8080, () => console.log('Example app listening on port 80!'))