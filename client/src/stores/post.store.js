import http from '../utils/appHttp.js';
import moment from 'moment';

var postsCache = {};

var postStore = {
  fetchPosts(sort, page, startDate, endDate, callback) {
    var cache = this.getPostsCache(sort, page, startDate, endDate);
    if (cache) {
      callback(null, cache);
      return;
    }
    var _startDate = startDate ?
      moment(startDate._d).format('YYYY-MM-DD') : '2006-1-1';
    var _endDate = endDate ?
      moment(endDate._d).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD');
    var url = '/api/posts/' + sort + '/' + _startDate + '/' + _endDate + '/' + page;
    http._get(url, function(err, res) {
      if (err) return;
      postsCache[sort + page + startDate + endDate] = res;
      callback(err, res);
    });
  },

  preFetch(sort, page, startDate, endDate) {
    for (var i = 1; i < 3; i++) {
      this.fetchPosts(sort, page + i, startDate, endDate, (err, res) => {});
    }
  },

  getPostsCache(sort, page, startDate, endDate) {
    return postsCache[sort + page + startDate + endDate];
  },

  initPreFetch(page, startDate, endDate) {
    this.fetchPosts('replies', page, startDate, endDate, (err, res) => {});
    this.fetchPosts('createDate', page, startDate, endDate, (err, res) => {});
  },

  saveInputs(sort, page, startDate, endDate) {
    var savedInputs = { sort: sort, page: page, startDate: startDate, endDate: endDate };
    localStorage.savedInputs = JSON.stringify(savedInputs);
  },

  getSavedInputs() {
    if (!localStorage.savedInputs)
      return { sort: 'views', page: 1, startDate: null, endDate: null };
    return JSON.parse(localStorage.savedInputs);
  }
};

export default postStore;
