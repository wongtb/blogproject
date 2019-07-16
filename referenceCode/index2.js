// FileName: index.js
// Import express
const express = require('express')
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');

const apiRoutes = require("./api-routes")
// Initialize the app
let app = express()
// Setup server port
var port = process.env.PORT || 8080;

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// send messsage for default URL
app.get('/', (req, res) => {
    console.log(req.body);
    res.send('Hello World with Express')
}); 



// Import routes

// Use API routers in the app
app.use('/api', apiRoutes)



// Conenct to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/resthub');
var db = mongoose.connection; 

// Launch app to listen to specified port
app.listen(port, function() {
    console.log("Running RestHub on prot " + port); 
})

