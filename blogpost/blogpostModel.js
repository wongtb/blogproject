var mongoose = require('mongoose');

// Setup schema
var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },    
    author: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    likeCounter: {
        type: Number,
        default: 0 
    }, 
    create_date: {
        type: Date,
        default: Date.now
    },

    edit_date: {
        type: Date,
        default: Date.now
    }
});

// Export Contact model
var Contact = module.exports = mongoose.model('blogPost', postSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}