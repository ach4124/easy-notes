import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ username, logout }) => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <ul className="nav inline-navbar">
        <li><Link to="/"><i className="glyphicon glyphicon-home"/> All your posts
        </Link></li>
        <li><Link to="/manager"><i className="glyphicon glyphicon-th-list"/> Manage your posts
        </Link></li>
        <li><Link to="/active"><i className="glyphicon glyphicon-pencil"/> Active posts
        </Link></li>
        <li><Link to="/" onClick={logout}>Log out</Link></li>
      </ul>
      <span className="nav inline-navbar justify-content-end">
        Welcome, {username}.
      </span>
    </div>
  </nav>
);

export default Navigation;