import http from '../utils/appHttp.js';
import moment from 'moment';

var postsCache = {};

var postStore = {
  fetchPosts(sort, page, startDate, endDate, callback) {
    var cache = this.getPostsCache(sort, page, startDate, endDate);
    if(cache) {
      callback(null, cache);
      return;
    }
    var _startDate = startDate ?
      moment(startDate._d).format('YYYY-MM-DD') : '2006-1-1';
    var _endDate = endDate ?
      moment(endDate._d).add(1, 'days').format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD');
    var prefix = location.port === 8000 ? '' : 'http://localhost:8000'
    var url = prefix + '/api/posts/' + sort + '/' + _startDate + '/' + _endDate + '/' + page;
    http._get(url, function(err, res) {
      if (err) return;
      postsCache[sort + page + startDate + endDate] = res;
      callback(err, res);
    });
  },

  preFetch(sort, page, startDate, endDate) {
    for(var i = 1; i < 3; i++) {
      this.fetchPosts(sort, page + i, startDate, endDate, (err, res) => {});  
    }
  },

  getPostsCache(sort, page, startDate, endDate) {
    return postsCache[sort + page + startDate + endDate];
  },

  initPreFetch(startDate, endDate) {
    this.fetchPosts('replies', 1, startDate, endDate, (err, res) => {});
    this.fetchPosts('createDate', 1, startDate, endDate, (err, res) => {});
  },

  saveInputs(sort, page, startDate, endDate) {
    var savedInputs = {sort: sort, page: page, startDate: startDate, endDate: endDate};
    localStorage['savedInputs'] = JSON.stringify(savedInputs);
  },

  getSavedInputs() {
    return JSON.parse(localStorage.savedInputs);
  }
};

function saveSort(sort) {
  localStorage['mitbbsSort'] = sort;
}

function saveDate(startDate, endDate) {
  localStorage['mitbbsStartDate'] = startDate;
  localStorage['mitbbsEndDate'] = endDate;
}

function savePage(page) {
  localStorage['mitbbsPage'] = page;
}

var stringify = function(obj) {
  var str = '';
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var line = p + '::' + obj[p] + '\n';

      str += line;
    }
  }
  return str;
}

export default postStore;
