var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  _id: Number,
  title: String,
  author: String,
  link: String,
  views: Number,
  replies: Number,
  createDate: Date,
  updateDate: Date
});

module.exports = mongoose.model('Post', postSchema);
