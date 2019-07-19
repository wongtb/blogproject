const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const dotenv = require('dotenv').config(); // Import environment variables

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');


// CREATES A NEW USER ->  POST /api/user/
router.post('/', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");

            //create a toekn
            var token = jwt.sign({ id: user._id}, process.env.SECRET, {
                expiresIn: 86400 // 24hrs;
            });
            res.status(200).send({ auth: true, token: token }); 

        });
});

// LOGIN A USER -> POST /api/user/login
router.post('/login', function(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      
      var token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 86400 // expires in 24 hours
      });
      
      res.status(200).send({ auth: true, token: token });
    });
    
  });

// LOGOUT A USER -> DELETE /api/user/login
router.delete('/login', function( req, res){

    // return temporary OOS signal
    return res.status(404).send('User not logged out.  Function not implemented yet.')

    // decrypt the users sent JWT here
    // return an expired JWT here
    var token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 0 // expire now
      });
})
  

// RETURNS ALL THE USERS IN THE DATABASE -> GET /api/user/
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE -> GET /api/users/:id
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE -> DELETE /api/users/:id
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE -> PUT /api/users/:id
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports = router;