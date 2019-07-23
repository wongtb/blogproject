const jwt = require('jsonwebtoken');
    bcrypt = require('bcryptjs'); 
    User = require('./User')

exports.validateToken = function(req, res, next) {

    var token = req.headers['x-access-token']; 

    // No Token
    if(!token) return res.status(401).send({ auth : false, message: 'No token provided.'}); 

    // Token Provided
    jwt.verify(token, process.env.DB_SECRET, function(err, decoded){ 

        // Could not receive ID
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });  

        // Received ID
        User.findById(decoded.id, { password: 0 }, function (err, user) { 
            if (err) return res.status(500).send("There was a problem finding the user."); 
            if (!user) return res.status(404).send("No user found.");             
            req.user_id = decoded.id;  
            next(); 
        });
    });
}

//module.exports = exports