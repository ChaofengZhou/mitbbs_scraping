import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar.jsx';
import Content from './components/Content.jsx';
import PostList from './components/PostList.jsx';
import Footer from './components/Footer.jsx';

var App = (
  <div>
    <Navbar />
    <Content />
    <Footer />
  </div>
);

ReactDOM.render(App, document.getElementById('app'));
