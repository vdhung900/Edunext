import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Accordion, Spinner, Alert, Image, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCircle } from "react-icons/fa";

import './Group.css';  // Assuming you'll create a CSS file for custom styling

function Group({ slotid }) {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [enrollmentGroups, setEnrollmentGroups] = useState([]);
  const [groupOfUser, setGroupOfUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, enrollmentGroupsResponse, groupsResponse] = await Promise.all([
          axios.get('http://localhost:9999/users'),
          axios.get('http://localhost:9999/enrollmentgroup'),
          axios.get('http://localhost:9999/group', {
            params: { slotID: slotid }
          })
        ]);

        setUsers(usersResponse.data);
        setGroups(groupsResponse.data);
        setEnrollmentGroups(enrollmentGroupsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [slotid]);

  useEffect(() => {
    if (enrollmentGroups.length > 0) {
      const userEnrollment = enrollmentGroups.find(enroll => enroll.userID === userId);
      if (userEnrollment) {
        setGroupOfUser(userEnrollment.groupID);
      }
    }
  }, [enrollmentGroups, userId]);

  const getUsersByGroupID = useCallback((groupID) => {
    const enrolledUsers = enrollmentGroups.filter(enroll => enroll.groupID == groupID);
    return enrolledUsers.map(enroll => {
      const user = users.find(user => user.id === enroll.userID);
      return { ...user, groupID: enroll.groupID };
    });
  }, [enrollmentGroups, users, userId]);

  const usersInGroup = groupOfUser ? getUsersByGroupID(groupOfUser) : [];

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div className="group-container">
      {usersInGroup.length > 0 ? (
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header><b>My Group</b></Accordion.Header>
            <Accordion.Body>
              <div className="group-list">
                {usersInGroup.map(user => (
                  <Row style={{ margin: '10px 5px' }}>
                    <Col sm={1}>
                      <Image src="/ava.png" roundedCircle style={{ border: `1px solid black`, height: '50px', width: '50px' }} />
                    </Col>
                    <Col sm={5}>
                      <b>{user.fullname}</b>
                      <p><i>{user.email}</i></p>
                    </Col>
                    <Col sm={1}></Col>
                    <Col sm={5}>
                      <span className={`status-indicator ${user.id === userId ? 'online' : 'offline'}`}><b><FaCircle style={{ width: '15px' }}/> {user.id === userId ? 'online' : 'offline'}</b></span>
                    </Col>
                  </Row>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : (
        <p>No users found for this group.</p>
      )}
    </div>
  );
}

export default Group;
