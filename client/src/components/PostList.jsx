import React from 'react';

export default class PostList extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    var posts = this.props.posts.map(post => <Post key={post._id} post={post} />);
    return (
      <div id='posts'>
        <ul id="post-list"> {posts} </ul>
      </div>
    );
  }
}

class Post extends React.Component {
  render() {
    var post = this.props.post;
    return (
      <li className="post">
        <a href={"http://www.mitbbs.com" + post.link} target="_blank">{post.title}</a> 
        <span className="pull-right">{post.author}</span> 
        <br />
        <span>{post.createDate.substring(0, 10)}</span>
        <span className="pull-right">{post.replies} / {post.views}</span> 
      </li>
    );
  }
}

