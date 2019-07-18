// Import express
const express = require('express');
// Import Body parser
const bodyParser = require('body-parser');
// Import Mongoose
const mongoose = require('mongoose');
// Import routes
const apiRoutes = require("./api-routes")

//const util = require('util')

// Initialize the app
let app = express();

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Connect to server

/*
var user = 'username';
var password = 'password';
var server = 'localhost'; 
var url = util.format('mongodb://%s:%s@%s/blogProject?authMechhanism=PLAIN', user, password, server);
mongoose.connect(url);
*/

//console.log(process.env.MONGODB_ENV=='docker');
//console.log(process.env.MONGODB_ENV);

if (process.env.MONGODB_ENV=='docker')
    mongoose.connect('mongodb://mongo:27017/blogProject');
else 
    mongoose.connect('mongodb://localhost:27017/blogProject');

var db = mongoose.connection;
// Setup server port
const port = process.env.PORT || 3000;
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
// Use Api routes in the App
app.use('/api', apiRoutes)
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});