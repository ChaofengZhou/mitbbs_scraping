import React from 'react';
import ReactDOM from 'react-dom';
import PostList from './PostList.jsx';
import DatePicker from 'react-datepicker';
import postStore from '../stores/post.store';
import moment from 'moment';

var loading = false;

export default class Content extends React.Component {
  constructor(props) {
    super(props);
    this.updatePosts = this.updatePosts.bind(this);
    
    this.onViews = this.onViews.bind(this);
    this.onReplies = this.onReplies.bind(this);
    this.onNewest = this.onNewest.bind(this);

    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.onPageChange = this.onPageChange.bind(this);

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);

    var savedInputs = postStore.getSavedInputs();
    this.state = {
      posts: [],
      sort: savedInputs.sort,
      page: savedInputs.page,
      startDate: savedInputs.startDate ? moment(savedInputs.startDate) : null,
      endDate: moment()
    };
  }

  onViews(e) {
    if(this.state.sort === 'views') return;
    this.updatePosts('views', 1, this.state.startDate, this.state.endDate);
  }

  onReplies(e) {
    if(this.state.sort === 'replies') return;
    this.updatePosts('replies', 1, this.state.startDate, this.state.endDate);
  }

  onNewest(e) {
    if(this.state.sort === 'createDate') return;
    this.updatePosts('createDate', 1, this.state.startDate, this.state.endDate);
  }

  handleChangeStart(date) {
    this.updatePosts(this.state.sort, this.state.page, date, this.state.endDate);
  }

  handleChangeEnd(date) {
    this.updatePosts(this.state.sort, this.state.page, this.state.startDate, date);
  }

  onNext(e) {
    var nextPage = this.state.page + 1;
    this.updatePosts(this.state.sort, nextPage, this.state.startDate, this.state.endDate);  
  }

  onPrev(e) {
    var prevPage = this.state.page - 1;
    if(prevPage < 1) return;
    this.updatePosts(this.state.sort, prevPage, this.state.startDate, this.state.endDate);  
  }

  onPageChange(e) {
    var page = parseInt(e.target.value);
    this.updatePosts(this.state.sort, page, this.state.startDate, this.state.endDate);
  }

  updatePosts(sort, page, startDate, endDate, callback) {
    if(loading) return;
    loading = true;
    postStore.fetchPosts(sort, page, startDate, endDate, (res, posts) => {
      this.setState({sort: sort, posts: posts, page: page, startDate: startDate, endDate: endDate});
      postStore.preFetch(sort, page, startDate, endDate);
      if(callback) callback();
    });
  }

  componentDidMount() {
    this.updatePosts(this.state.sort, this.state.page, this.state.startDate, this.state.endDate, () => {
      postStore.initPreFetch(this.state.page, this.state.startDate, this.state.endDate);  
    });
  }

  componentDidUpdate(prevProps, prevState) {
    postStore.saveInputs(this.state.sort, this.state.page, this.state.startDate, this.state.endDate);
  }

  render() {
    var active = {views: '', replies: '', createDate: ''};
    active[this.state.sort] = 'active';
    loading = false;
    
    return (
      <div id="content">
        <div id="filter">
          <div id="sort-group">
            <a className={"btn " + active.views} onClick={this.onViews}>Top Views</a>
            <a className={"btn " + active.replies} onClick={this.onReplies}>Top Replies</a>
            <a className={"btn " + active.createDate} onClick={this.onNewest}>Newest</a>
          </div>
          <div id='date-group'>
            <DatePicker
              id="startDate"
              dateFormat="YYYY/MM/DD"
              selected={this.state.startDate}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.handleChangeStart} />
              <span>to</span>
            <DatePicker
              id="endDate"
              dateFormat="YYYY/MM/DD"
              selected={this.state.endDate}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={this.handleChangeEnd} />
          </div>
          <div id="page-group">
            <span className='page-turn' onClick={this.onPrev}>prev</span>
            <input id='curr-page' type="number" onChange={this.onPageChange} value={this.state.page}/>
            <span className='page-turn' onClick={this.onNext}>next</span>
          </div>
        </div>
        <PostList posts={this.state.posts} />
      </div>
    );
  }
};
