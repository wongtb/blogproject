const BlogPost = require('./blogpostModel');
    jwt = require('jsonwebtoken');
    bcrypt = require('bcryptjs'); 
    User = require('../user/User')
    validateToken = require('../user/authenticateUser')

// Handle index actions
exports.index = function (req, res) { 
    // If query is invalid, error out
    var offset = +req.query.offset ? +req.query.offset : 0; 
        limit = +req.query.limit ? +req.query.limit : 10; 

    BlogPost
        .find({})
        .skip(offset)
        .limit(limit)
        .exec(function(err, blogpost) {
            BlogPost.count().exec(function(err, count) {
            var startingVal = +offset + +1;
            var endingVal = Math.min(+offset + +limit, +count);

            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }

            if (offset > count) {
                res.json({
                    status: "error",
                    message: "offset is greater than the size of the database.  no data can be returned"
                })
            }

            res.json({
                status: "success",
                message: "Blogs (" + String(+startingVal) + " to " + String(+endingVal) + ") have been retrieved.",
                data: blogpost,
                nextOffset: (count > (+offset+ +limit)) ? (+offset + +limit) : +offset
            });
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {

    // Send Post
    var blogpost = new BlogPost();
    blogpost.title = req.body.title; 
    blogpost.author = req.user_id; 
    blogpost.post = req.body.post;
    blogpost.likeCounter = 0; 

    // save the Blog Post and check for errors
    blogpost.save(function (err) {
        if (err) {res.json(err);}

        res.json({
            message: 'New post created!',
            id: blogpost._id
        });
    });
}


// Handle view contact info
exports.view = function (req, res) {
    BlogPost.findById(req.params.post_id, function (err, blogpost) {
        // cannot be found
        if (err) {return res.status(400).send(err);}
        if (!blogpost) {return res.status(400).send("Blog post " + req.params.post_id + " was not found.")}

        res.json({
            message: 'Blog retrieved',
            data: blogpost
        });
    });
};


// Handle update blog post
exports.update = function (req, res) {
    BlogPost.findById(req.params.post_id, function (err, blogpost) {
        if (err) {return res.status(400).send(err);};
        if (!blogpost) {return res.status(400).send("Blog post with ID " + req.params.post_id + " was not found.")}
        if (blogpost.author!=req.user_id) {return res.status(401).send("You do not have the authorization to edit this post.")}; 

        //console.log('Blogpost Author ID = ' + blogpost.author);
        //console.log('Token ID = ' + blogpost.author);
        //console.log('Not Equal? = ' + String(blogpost.author!=req.user_id)); 

         // save the blog post and check for errors
        blogpost.post = req.body.post;
        blogpost.edit_date = new Date();
        blogpost.save(function (err) {
            if (err) {return res.status(400).send("Failed to save data to database.  Error: " + err);}
            res.json({
                message: 'Blog Post updated',
                data: blogpost
            });
        });
    });
}; 

// delete a blog post
exports.delete = function (req, res) {
    BlogPost.findById(req.params.post_id, function (err, blogpost) {
        if (err) {return res.status(400).send(err);};
        if (!blogpost) {return res.status(400).send("Blog post with ID " + req.params.post_id + " was not found.")}
        if (blogpost.author!=req.user_id) {return res.status(401).send("You do not have the authorization to delete this post.")}; 

        blogpost.remove({_id: req.params.post_id}, function (err, contact) {
            if (err) { return res.status(400).send("Failed to delete data from database.  Error: " + err);}
            res.json({
                status: "success",
                message: 'Blog post deleted'
            });
        });
    }); 
};

//upvote a blog post
exports.upvote = function (req, res) {
    BlogPost.findById(req.params.post_id, function (err, blogpost) {
        if (err) { return res.send(err);}
        if (!blogpost) {return res.status(400).send("Blog post with ID " + req.params.post_id + " was not found.")}
        if (!req.user_id) {return res.status(401).send("Please log in to upvote or downvote")}; 

        blogpost.likeCounter++; 

        // save the new blogpost save counter
        blogpost.save(function (err) {
            if (err)
                return res.json(err);
            res.json({
                message: 'Blog Post upvoted',
                data: blogpost.likeCounter
            });
        });
    });
};


//downvote a blog post
exports.downvote = function (req, res) {
    BlogPost.findById(req.params.post_id, function (err, blogpost) {
        if (err) { return res.send(err);}
        if (!blogpost) {return res.status(400).send("Blog post with ID " + req.params.post_id + " was not found.")}
        if (!req.user_id) {return res.status(401).send("Please log in to upvote or downvote")}; 

        blogpost.likeCounter--; 

        // save the new blogpost save counter
        blogpost.save(function (err) {
            if (err)
                return res.json(err);
            res.json({
                message: 'Blog Post downvoted',
                data: blogpost.likeCounter
            });
        });
    });
};