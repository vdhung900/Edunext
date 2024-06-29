import React from 'react';
import './styles.css';

function SideNav() {
  return (
    <div className="sidenav">
      <div className="logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Assignments</a>
        <a href="#">Grades</a>
        <a href="#">Messages</a>
        <a href="#">Resources</a>
        <a href="#">Help</a>
      </div>
    </div>
  );
}

export default SideNav;
