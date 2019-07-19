// Import all required packages
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const apiRoutes = require("./api-routes")
const userRoutes = require("./user/UserController")

// Initialize the app
let app = express();

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setup connection to the database
require('./database'); 

// Send message for default URL
app.get('/', (req, res) => res.send('Blog Server is up.'));

// Use Api routes in the App
app.use('/api', apiRoutes)
app.use('/api/user', userRoutes)

// Launch app to listen to specified port
app.listen(process.env.SERVER_PORT, function () { console.log("Running RestHub on port " + process.env.SERVER_PORT);});