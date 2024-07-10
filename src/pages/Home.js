import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Nav, Card, Button, Form } from 'react-bootstrap';
import { FaHome, FaBook, FaCalendar, FaHeadset, FaQuestion, FaUserCircle, FaFilePdf, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; // Assuming this is the correct path to your AuthContext
import SideBar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const { userId, fullname, roleName } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  if (!userId) {
    navigate('/login');
  }

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
    return enrollments.filter(enroll => enroll.classID === classID).length;
  };

  const filteredSubjects = selectedSemesterId
    ? subjects.filter(subject => subject.semesterID == selectedSemesterId)
    : subjects;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <Container fluid>
      <Row>
        <Col md={isSidebarOpen ? 2 : 1} style={{ paddingLeft: '0px' }}>
          <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </Col>

        <Col md={isSidebarOpen ? 10 : 11} className="main-content">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <div>
              <h1 className="h2">Courses</h1>
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
                    <Button variant="primary" onClick={() => navigate(`/course/${subject.id}`)}>
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
