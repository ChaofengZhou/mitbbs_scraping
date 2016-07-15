var Post = require('./post.model');
var moment = require('moment');
// var _ = require('lodash');

exports.showSortedPage = function(req, res) {
  var sortBy = req.params.sort || 'views';
  var pageNum = req.params.page || 1;
  var skip = (pageNum - 1) * 30 < 0 ? 0 : (pageNum - 1) * 30;

  var startDate = new Date(req.params.startDate);
  var endDate = new Date(req.params.endDate);

  Post.find({
      createDate: {
        $gte: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
        $lte: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
      }
    })
    .sort('-' + sortBy)
    .skip(skip)
    .limit(30)
    .exec(function(err, posts) {
      if (err) return res.status(500).json(err);
      return res.status(200).json(posts);
    });
};
