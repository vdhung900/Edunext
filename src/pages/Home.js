import axios from 'axios';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { FaChalkboardTeacher, FaUserCircle, FaUsers } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; // Assuming this is the correct path to your AuthContext
import SideBar from '../components/SideBar';
import { useNavigate } from 'react-router-dom';
import Project from '../components/Project';

function Home() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const { userId, roleName } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState('courses');

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }

    const fetchData = async () => {
      try {
        const [classesResponse, subjectsResponse, semestersResponse, enrollmentsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:9999/classes'),
          axios.get('http://localhost:9999/subjects'),
          axios.get('http://localhost:9999/semesters'),
          axios.get('http://localhost:9999/enrollment'),
          axios.get(`http://localhost:9999/users/${userId}`),
        ]);

        setClasses(classesResponse.data);
        setSubjects(subjectsResponse.data);
        setSemesters(semestersResponse.data);
        setEnrollments(enrollmentsResponse.data);
        setUsers(usersResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [userId, navigate]);

  const handleSelected = (semesterId) => {
    setSelectedSemesterId(semesterId);
  };

  const countEnrollments = useCallback((classID) => {
    return enrollments.filter(enroll => enroll.classID == classID).length;
  }, [enrollments]);

  const filteredSubjects = useCallback(() => {
    return selectedSemesterId
      ? subjects.filter(subject => subject.semesterID == selectedSemesterId)
      : subjects;
  }, [selectedSemesterId, subjects]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Component for rendering courses for students
  const StudentView = () => {
    const userEnrolledSubjects = filteredSubjects().filter(subject =>
      classes.some(classItem =>
        classItem.subjectID == subject.id &&
        enrollments.some(enroll => enroll.classID == classItem.id && enroll.userID == userId)
      )
    );

    return (
      <>
        <Form.Group className="mb-4 semester-select">
          <Row>
            <Col sm={1} style={{ marginRight: '30px', marginTop: '7px' }}>
              <Form.Label htmlFor="semester">
                SEMESTER:
              </Form.Label>
            </Col>
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
          </Row>

        </Form.Group>

        <Row>
          <p style={{ color: '#297FFD', cursor: 'pointer' }}>Recently Updated (Để xem chi tiết về các thay đổi cập nhật gần đây, vui lòng nhấp vào đây)</p>
          {userEnrolledSubjects.map((subject) => (
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
                      return null;
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
      </>
    );
  };

  // Component for rendering courses for teachers
  const TeacherView = () => {
    const countEnrollments = (subjectID) => {
      const classIDs = classes
        .filter(classItem => classItem.lectureID == userId && classItem.subjectID == subjectID)
        .map(classItem => classItem.id);

      return enrollments.filter(enroll => classIDs.includes(enroll.classID)).length;
    };

    const filteredSubjects = selectedSemesterId
      ? subjects.filter(subject =>
        subject.semesterID == selectedSemesterId &&
        classes.some(classItem => classItem.lectureID == userId && classItem.subjectID == subject.id)
      )
      : subjects.filter(subject =>
        classes.some(classItem => classItem.lectureID == userId && classItem.subjectID == subject.id)
      );

    return (
      <>
        <Form.Group as={Row} className="mb-4 semester-select">
          <Col sm={1} style={{ marginRight: '30px', marginTop: '7px' }}>
            <Form.Label htmlFor="semester">
              SEMESTER:
            </Form.Label>
          </Col>
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
          <p style={{ color: '#297FFD', cursor: 'pointer', fontSize: '20px', textDecoration: 'underline' }}>Join: The Edunext Zalo community for teachers FU</p>
          {filteredSubjects.map((subjectItem) => (
            <Col key={subjectItem.id} md={4} className="mb-4">
              <Card className="h-100 d-flex flex-column justify-content-between">
                <Card.Body>
                  {classes.map((classItem) => {
                    if (classItem.lectureID == userId && classItem.subjectID == subjectItem.id) {
                      return (
                        <div key={classItem.id}>
                          <Card.Title className='d-flex align-items-center' style={{ height: '50px' }}>
                            {subjectItem.name}
                          </Card.Title>
                          <div className='d-flex align-items-center mt-3'>
                            <FaChalkboardTeacher style={{ color: 'lightgrey', marginRight: '5px' }} />
                            {classItem.className} - {subjectItem.code}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                  <Card.Text className='d-flex align-items-center mt-3'>
                    <FaUserCircle style={{ color: 'lightgrey', marginRight: '5px' }} />
                    {users.email}
                  </Card.Text>
                  <Card.Text className='d-flex align-items-center'>
                    <FaUsers style={{ color: 'lightgrey', marginRight: '5px' }} />
                    Number of students: {countEnrollments(subjectItem.id)}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button variant="primary" onClick={() => navigate(`/course/${subjectItem.id}`)}>
                    Go to course
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col md={isSidebarOpen ? 2 : 1} style={{ paddingLeft: '0px' }}>
          <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </Col>

        <Col md={isSidebarOpen ? 10 : 11} className="main-content">
          <div className="d-flex flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <div onClick={() => setView('courses')} style={{ cursor: 'pointer' }}>
              <h1 className="h2">Courses</h1>
            </div>
            <div onClick={() => setView('project')} style={{ marginLeft: '30px', cursor: 'pointer' }}>
              <h1 className="h2">Project</h1>
            </div>
          </div>
          {view === 'courses' ? (
            roleName === 'Student' ? <StudentView /> : <TeacherView />
          ) : (
            <Project />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
