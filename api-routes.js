// api-routes.js
// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
// Import blog post controller and Routes
var blogpost = require('./blogpost/blogpostController');
var authentication = require('./user/authenticateUser')

router.route('/blogpost')
    .get(blogpost.index)
    .post(authentication.validateToken, blogpost.new)
    .put(function(req, res){
        console.log(isNaN(req.query.offset))
        //console.log("2" + req.query.hih)
    });

router.route('/blogpost/:post_id')
    .get(blogpost.view)
    .patch(authentication.validateToken, blogpost.update)
    .put(authentication.validateToken, blogpost.update)
    .delete(authentication.validateToken,blogpost.delete);

router.route('/blogpost/upvote/:post_id')
    .put(authentication.validateToken, blogpost.upvote)

router.route('/blogpost/downvote/:post_id')
    .put(authentication.validateToken, blogpost.downvote)
    

// Export API routes
module.exports = router;