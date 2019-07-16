// contactController.js
// Import contact model
BlogPost = require('./blogpostModel');


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
    var blogpost = new BlogPost();
    //console.log(req); 

    blogpost.title = req.body.title; 
    blogpost.author = req.body.author;
    blogpost.post = req.body.post;
    blogpost.likeCounter = 0; 
    blogpost.create_date = req.body.create_date;

// save the contact and check for errors
    blogpost.save(function (err) {
         //if (err)
         //   res.json(err);
        res.json({
            message: 'New post created!',
            data: blogpost.title
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

// save the contact and check for errors
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

// Handle delete contact
/*
exports.delete = function (req, res) {
    Contact.remove({
        _id: req.params.contact_id
    }, function (err, contact) {
        if (err)
            res.send(err);
res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};
*/