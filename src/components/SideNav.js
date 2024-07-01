import React from 'react';
import './styles.css';
import { Container, Row, Col, Nav, Card, Button, Form, CardText } from 'react-bootstrap';
import { FaHome, FaBook, FaCalendar, FaHeadset, FaQuestion, FaUserCircle, FaFilePdf, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';


function SideNav() {
  return (
    <Nav className="flex-column">
      <Nav.Item className="logo-item d-flex">
        <img style={{ width: '70px' }} src="../logo.png" alt="FPT Logo" className="logo" />
        <p style={{ marginLeft: '10px', marginTop: '10px', color: '#0768B1' }}>Education</p>
      </Nav.Item>
      <Nav.Item className='d-flex mt-3'>
        <Nav.Link active href="#" style={{ color: 'black' }}>
          <FaUserCircle /> NameStudent
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" style={{ color: 'black' }}>
          <FaHome /> Home
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" style={{ color: 'black' }}>
          <FaBook /> Assignments
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" style={{ color: 'black' }}>
          <FaCalendar /> Upcoming slots
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" style={{ color: 'black' }}>
          <FaFilePdf /> Read user guide
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" style={{ color: 'black' }}>
          <FaHeadset /> Contact Support
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#" style={{ color: 'black' }}>
          <FaQuestion /> FAQ
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SideNav;
