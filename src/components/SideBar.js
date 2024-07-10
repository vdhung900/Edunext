import React, { useState, useContext } from 'react';
import { Nav, Dropdown } from 'react-bootstrap';
import { FaBars, FaHome, FaBook, FaCalendar, FaHeadset, FaQuestion, FaUserCircle, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FQA from './FQA';
import ContactSupport from './ContactSupport';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import './SideBar.css'; // Ensure you import your CSS file

const SideBar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { userId, fullname, roleName } = useContext(AuthContext);

  const [showFQA, setShowFQA] = useState(false);
  const handleShowFQA = () => setShowFQA(true);
  const handleCloseFQA = () => setShowFQA(false);

  const [showContact, setShowContact] = useState(false);
  const handleShowContact = () => setShowContact(true);
  const handleCloseContact = () => setShowContact(false);

  return (
    <div className={`bg-light sidebar ${isSidebarOpen ? 'open' : 'closed'}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh', borderRight: '1px solid #ccc' }}>
      <Nav className="flex-column" style={{ flexGrow: 1 }}>
        <Nav.Item className="logo-item d-flex align-items-center">
          <img style={{ width: '100%' }} src="/logo.png" alt="FPT Logo" className="logo" onClick={() => navigate('/')}/>
        </Nav.Item>
        <Dropdown className='d-flex mt-3' style={{ marginLeft: '10px' }}>
          <Dropdown.Toggle className="d-flex align-items-center dropdown-toggle">
            <FaUserCircle />
            <div style={{ marginLeft: '5px' }}></div>{isSidebarOpen && ` ${fullname} (${roleName})`}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ width: '80%', marginLeft: '10px' }}>
            <Dropdown.Item as="div">
              <LogoutButton />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Nav.Item className="toggle-sidebar d-flex mt-3" onClick={toggleSidebar}>
          <FaBars style={{ marginLeft: '30px' }} />
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link onClick={() => navigate('/')} className="nav-link">
            <FaHome />
            <div style={{ marginLeft: '5px' }}> {isSidebarOpen && ' Home'}</div>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link onClick={() => navigate('/assignment')} className="nav-link">
            <FaBook />
            <div style={{ marginLeft: '5px' }}></div>{isSidebarOpen && ' Assignments'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link onClick={() => navigate('/upcoming-slots')} className="nav-link">
            <FaCalendar />
            <div style={{ marginLeft: '5px' }}></div>{isSidebarOpen && ' Upcoming slots'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link href={`${process.env.PUBLIC_URL}/user_guide.pdf`} download="user_guide.pdf" className="nav-link">
            <FaFilePdf />
            <div style={{ marginLeft: '5px' }}></div>{isSidebarOpen && ' Read user guide'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link onClick={handleShowContact} className="nav-link">
            <FaHeadset />
            <div style={{ marginLeft: '5px' }}></div>{isSidebarOpen && ' Contact Support'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link onClick={handleShowFQA} className="nav-link">
            <FaQuestion />
            <div style={{ marginLeft: '5px' }}></div>{isSidebarOpen && ' FAQ'}
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <ContactSupport show={showContact} handleClose={handleCloseContact} />
      <FQA show={showFQA} handleClose={handleCloseFQA} />
    </div>
  );
};

export default SideBar;
