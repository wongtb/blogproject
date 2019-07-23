const BlogPost = require('./blogpostModel');
    jwt = require('jsonwebtoken');
    bcrypt = require('bcryptjs'); 
    User = require('../user/User')

// Handle index actions
exports.index = function (req, res) { 
    BlogPost.get(function (err, blogpost) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Blog titles retrieved successfully",
            data: blogpost
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {

    // code for handling JWT
    var token = req.headers['x-access-token']; 
    if(!token) return res.status(401).send({ auth : false, message: 'No token provided.'}); 
    jwt.verify(token, process.env.DB_SECRET, function(err, decoded){ 
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });  
        User.findById(decoded.id, { password: 0 }, function (err, user) { 
            if (err) return res.status(500).send("There was a problem finding the user."); 
            if (!user) return res.status(404).send("No user found.");             
            res.status(200);

            // Send Post
            var blogpost = new BlogPost();
            blogpost.title = req.body.title; 
            blogpost.author = decoded.id; 
            blogpost.post = req.body.post;
            blogpost.likeCounter = 0; 
            //blogpost.create_date = req.body.create_date;
        
            // save the Blog Post and check for errors
            blogpost.save(function (err) {
                res.json({
                    message: 'New post created!',
                    data: blogpost.title
                });
            });
        }); 
    }); 
};
// Handle view contact info
exports.view = function (req, res) {
    BlogPost.findById(req.params.contact_id, function (err, blogpost) {
        if (err)
            res.send(err);
        res.json({
            message: 'Blog retrieved',
            data: blogpost
        });
    });
};


// Handle update blog post
exports.update = function (req, res) {
    BlogPost.findById(req.params.contact_id, function (err, blogpost) {
        if (err)
            res.send(err);
        //blogpost.title = req.body.title; 
        //blogpost.author = req.body.author;
        blogpost.post = req.body.post;
        //blogpost.likeCounter = 0; 
        blogpost.create_date = blogpost.create_date ;

// save the blog post and check for errors
        blogpost.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Blog Post updated',
                data: blogpost
            });
        });
    });
}; 

// delete a blog post
exports.delete = function (req, res) {
    blogpost.remove({_id: req.params.contact_id}, 
    function (err, contact) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};

//upvote a blog post
exports.upvote = function (req, res) {
    BlogPost.findById(req.params.contact_id, function (err, blogpost) {
        if (err)
            res.send(err);
        blogpost.likeCounter++; 

        // save the new blogpost save counter
        blogpost.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Blog Post upvoted',
                data: blogpost
            });
        });
    });
};


//downvote a blog post
exports.downvote = function (req, res) {
    BlogPost.findById(req.params.contact_id, function (err, blogpost) {
        if (err)
            res.send(err);
        blogpost.likeCounter--; 

        // save the new blogpost save counter
        blogpost.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Blog Post downvoted',
                data: blogpost
            });
        });
    });
};