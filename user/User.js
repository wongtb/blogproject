var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
/*
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
  }
});*/