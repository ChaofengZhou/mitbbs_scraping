import React from 'react';

export default class Navbar extends React.Component {
  render() {
    var ul = (
      <ul>
        <li className="brand">Mitbbs Ranking</li>
      </ul>
    );
    return (
      <nav className="nav-bar">{ul}</nav>
    );
  }
};
