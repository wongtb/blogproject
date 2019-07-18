// Import express
const express = require('express');
// Import Body parser
const bodyParser = require('body-parser');
// Import Mongoose
const mongoose = require('mongoose');
// Import routes
const apiRoutes = require("./api-routes")
// Import users library
const userRoutes = require("./user/UserController")

// Import environment variables
const dotenv = require('dotenv').config(); 

// Initialize the app
let app = express();

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Connect to server
if (process.env.MONGODB_ENV=='docker') {
    //var DB_ServerIP = '172.19.0.2';
    var DB_ServerIP = 'mongo';
    var URIbase = 'mongodb://';
    DB_Username = process.env.DB_USER;
    DB_Password = process.env.DB_PASS;
    DB_Port = 27017; 
    DB_Name = 'blogProject'
    URI = URIbase.concat(DB_ServerIP, ':', DB_Port, '/', DB_Name);
    //URI = URIbase.concat(DB_Username, ':', DB_Password, '@', DB_ServerIP, ':', DB_Port, '/', DB_Name, '?authSource=admin');
} else {
    var DB_ServerIP = 'localhost';
    var URIbase = 'mongodb://';
    DB_Port = 27017; 
    DB_Name = 'blogProject'
    URI = URIbase.concat(DB_ServerIP, ':', DB_Port, '/', DB_Name);
}

//console.log(URI);
//console.log(process.env.DB_SECRET);
//console.log(process.env.DB_USER);
//console.log(process.env.DB_PASS);

mongoose.connect(encodeURI(URI)); 
//mongoose.connect('mongodb://brian:wong@mongo:27017/blogProject?authSource=admin');
//mongoose.connect('mongodb://mongo:27017/blogProject')
var db = mongoose.connection;


// Setup server port
const port = process.env.PORT || 3000;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));

// Use Api routes in the App
app.use('/api', apiRoutes)
app.use('/api/user', userRoutes)

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});