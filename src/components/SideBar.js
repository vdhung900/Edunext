import React, { useState, useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { FaBars, FaHome, FaBook, FaCalendar, FaHeadset, FaQuestion, FaUserCircle, FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FQA from './FQA';
import ContactSupport from './ContactSupport';
import { AuthContext } from '../context/AuthContext';
import LogoutButton from './LogoutButton'; // Ensure this import

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
    <div className={`bg-light sidebar ${isSidebarOpen ? 'open' : 'closed'}`} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Nav className="flex-column" style={{ flexGrow: 1 }}>
        <Nav.Item className="logo-item d-flex align-items-center">
          <img style={{ width: '70px' }} src="/logo.png" alt="FPT Logo" className="logo" />
          {isSidebarOpen && <p style={{ marginLeft: '10px', marginTop: '10px', color: '#0768B1' }}>Education</p>}
        </Nav.Item>
        <Nav.Item className="toggle-sidebar d-flex mt-3">
          <FaBars style={{ cursor: 'pointer', marginLeft: '15px' }} onClick={toggleSidebar} />
        </Nav.Item>
        {userId ? (
          <>
            <Nav.Item className='d-flex mt-3'>
              <Nav.Link active href="#" style={{ color: 'black', backgroundColor: '#E2E0DB', width: '100%' }}>
                <FaUserCircle />
                {isSidebarOpen && ` ${fullname} (${roleName})`}
              </Nav.Link>
            </Nav.Item>
          </>
        ) : (
          <Nav.Item className='d-flex mt-3'>
            <Nav.Link href="/login" style={{color: 'black'}}>
              <FaUserCircle /> {isSidebarOpen && ' Login'}
            </Nav.Link>
          </Nav.Item>
        )}
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link onClick={() => navigate(`/`)} style={{ color: 'black' }}>
            <FaHome />
            {isSidebarOpen && ' Home'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link href="/assignment" style={{ color: 'black' }}>
            <FaBook />
            {isSidebarOpen && ' Assignments'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link href="#" style={{ color: 'black' }}>
            <FaCalendar />
            {isSidebarOpen && ' Upcoming slots'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link href={`${process.env.PUBLIC_URL}/user_guide.pdf`} download="user_guide.pdf" style={{ color: 'black' }}>
            <FaFilePdf />
            {isSidebarOpen && ' Read user guide'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link href="#" style={{ color: 'black' }} onClick={handleShowContact}>
            <FaHeadset />
            {isSidebarOpen && ' Contact Support'}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className='d-flex mt-3'>
          <Nav.Link href="#" style={{ color: 'black' }} onClick={handleShowFQA}>
            <FaQuestion />
            {isSidebarOpen && ' FAQ'}
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="logout-section" style={{ marginTop: 'auto' }}>
        {userId && <LogoutButton />}
      </div>
      <ContactSupport show={showContact} handleClose={handleCloseContact} />
      <FQA show={showFQA} handleClose={handleCloseFQA} />
    </div>
  );
};

export default SideBar;
