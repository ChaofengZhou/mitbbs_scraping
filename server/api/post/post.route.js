var express = require('express');
var controller = require('./post.controller');
var router = express.Router();

router.get('/:sort/:startDate/:endDate/:page', controller.showSortedPage);

router.get('/', controller.showSortedPage);

// router.route('/:id', controller.showQuery)

module.exports = router;
