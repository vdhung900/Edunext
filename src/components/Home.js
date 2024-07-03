import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Nav, Card, Button, Form } from 'react-bootstrap';
import { FaHome, FaBook, FaCalendar, FaHeadset, FaQuestion, FaUserCircle, FaFilePdf, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; // Assuming this is the correct path to your AuthContext
import LogoutButton from './LogoutButton'; // Import the LogoutButton component

function Home() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const { userId, fullname, roleName } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await axios.get('http://localhost:9999/classes');
        const subjectsResponse = await axios.get('http://localhost:9999/subjects');
        const semestersResponse = await axios.get('http://localhost:9999/semesters');
        const enrollmentsResponse = await axios.get('http://localhost:9999/enrollment');

        setClasses(classesResponse.data);
        setSubjects(subjectsResponse.data);
        setSemesters(semestersResponse.data);
        setEnrollments(enrollmentsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleSelected = (semesterId) => {
    setSelectedSemesterId(semesterId);
  };

  const countEnrollments = (classID) => {
    return enrollments.filter(enroll => enroll.classID == classID).length;
  };

  const filteredSubjects = selectedSemesterId
    ? subjects.filter(subject => subject.semesterID == selectedSemesterId)
    : subjects;

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-light sidebar" style={{ height: '740px' }}>
          <Nav className="flex-column">
            <Nav.Item className="logo-item d-flex">
              <img style={{ width: '70px' }} src="logo.png" alt="FPT Logo" className="logo" />
              <p style={{ marginLeft: '10px', marginTop: '10px', color: '#0768B1' }}>Education</p>
            </Nav.Item>
            {userId ? (
              <>
                <Nav.Item className='d-flex mt-3'>
                  <Nav.Link active href="#" style={{ color: 'black' }}>
                    <FaUserCircle /> {fullname} ({roleName})
                  </Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <Nav.Item>
                <Nav.Link to href="/login" style={{ color: 'black' }}>
                  <FaUserCircle /> Login
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item>
              <Nav.Link href="#" style={{ color: 'black' }}>
                <FaHome /> Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link to href="/assignment" style={{ color: 'black' }}>
                <FaUserCircle /> Assignments
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
            {userId ? (
              <Nav.Item>
                <LogoutButton /> {/* Replace the static Logout link with LogoutButton */}
              </Nav.Item>
            ) : null}
          </Nav>
        </Col>

        <Col md={10} className="main-content">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <div>
              <h1 className="h2">Courses</h1>
            </div>
            <div style={{ marginLeft: '30px' }}>
              <h1 className="h2">Project</h1>
            </div>
          </div>

          <Form.Group as={Row} className="mb-4 semester-select">
            <Form.Label column sm={1} htmlFor="semester">
              SEMESTER:
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                as="select"
                id="semester"
                onChange={(e) => handleSelected(parseInt(e.target.value))}
              >
                <option value="">Trial</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>{semester.name}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>

          <Row>
            <p style={{ color: '#297FFD', cursor: 'pointer' }}>Recently Updated (Để xem chi tiết về các thay đổi cập nhật gần đây, vui lòng nhấp vào đây)</p>
            {filteredSubjects.map((subject) => (
              <Col key={subject.id} md={4} className="mb-4">
                <Card className="h-100 d-flex flex-column justify-content-between">
                  <Card.Body>
                    <Card.Title className='d-flex' style={{ height: '50px' }}>{subject.name}</Card.Title>
                    <Card.Text>
                      {classes.map((classItem) => {
                        if (classItem.subjectID == subject.id) {
                          return (
                            <Card.Text key={classItem.id} className='d-flex mt-3'>
                              <FaChalkboardTeacher style={{ color: 'lightgrey', marginRight: '5px', marginTop: '5px' }} />
                              {classItem.className} - {subject.code}
                            </Card.Text>
                          );
                        }
                      })}
                    </Card.Text>
                    <Card.Text><FaUserCircle style={{ color: 'lightgrey' }} /> edu_next_ltr_fpt_edu_02</Card.Text>
                    <Card.Text><FaUsers style={{ color: 'lightgrey' }} /> Number of students: {countEnrollments(subject.id)}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between">
                    <Button variant="primary" href="#">
                      Go to course
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
