const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const options = {
    useNewUrlParser: true,
    reconnectTries: process.env.DB_MAXRECONNECT,                
    reconnectInterval: process.env.DB_RECONNECTMS,
    family: 4             
};

var DB_ServerIP = (process.env.MONGODB_ENV == 'docker') ? 'mongo' : 'localhost'; // spin up mongo via docker-compose, then use mongo ip
var URI_AUTH = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + DB_ServerIP + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME + "?authSource=admin"
    URI_NOAUTH = 'mongodb://' + DB_ServerIP + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME; 
    URI = (process.env.MONGODB_ENV == 'docker') ? URI_AUTH : URI_NOAUTH; // if docker-compose, then mongo requires authorization.  
console.log(URI);

function connectToDB(URI, options, attempts) {
    setTimeout(()=>{
        attempts++; 
        if (attempts <= process.env.DB_MAXRECONNECT) {
            return mongoose.createConnection(URI, options).catch(error => {
                console.log('*** Retrying connection: ' + attempts + '/' + process.env.DB_MAXRECONNECT + ' ***'); 
                console.log('MongoDB Connection Error: ' + error);
                console.log('');
                connectToDB(URI, options, attempts);
            })
        }
    }, process.env.DB_RECONNECTMS); 
    return mongoose.connection
}

var db = connectToDB(URI, options, 0);
mongoose.connection.on('disconnected',  () => {console.log('*** Connection dropped *** ')});
mongoose.connection.on('error',  () => {console.log('*** Connection errored *** ')});
mongoose.connection.on('connected',  () => {console.log('*** Connection connected *** ')});

module.export = db; 