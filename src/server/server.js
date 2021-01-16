// Setup empty JS object to act as endpoint for all routes
var projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
const port = 8081

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, listening);

  }

function listening(){
    console.log(`server runing on ${port}`);
}

app.get('/get-place', function (req, res){
    res.send(projectData);
});

app.post('/set-place', function(req, res){
    projectData = req.body
    res.statusCode = 200
    res.end('yes');
});

module.exports = app;