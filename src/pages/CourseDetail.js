import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, DropdownButton, Dropdown, Row, Table, Accordion } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import CreateGroupModal from '../components/CreateGroupModal';
import { FaQuestionCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

function CourseDetail() {
    const { id } = useParams();
    const [slots, setSlots] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [classWithSubject, setClassWithSubject] = useState(null);
    const [studentClass, setStudentClass] = useState([]);
    const [groups, setGroups] = useState([]);
    const [enrollmentGroups, setEnrollmentGroups] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlotID, setSelectedSlotID] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userId, roleName } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    slotsResponse, subjectsResponse, usersResponse,
                    classesResponse, semestersResponse, questionsResponse,
                    enrollmentResponse, groupsResponse, enrollmentGroupsResponse
                ] = await Promise.all([
                    axios.get('http://localhost:9999/slots'),
                    axios.get(`http://localhost:9999/subjects/${id}`),
                    axios.get('http://localhost:9999/users'),
                    axios.get('http://localhost:9999/classes'),
                    axios.get('http://localhost:9999/semesters'),
                    axios.get('http://localhost:9999/questions'),
                    axios.get('http://localhost:9999/enrollment'),
                    axios.get('http://localhost:9999/group'),
                    axios.get('http://localhost:9999/enrollmentgroup')
                ]);

                setSlots(slotsResponse.data);
                setSubjects(subjectsResponse.data);
                setUsers(usersResponse.data);
                setClasses(classesResponse.data);
                setSemesters(semestersResponse.data);
                setQuestions(questionsResponse.data);
                setGroups(groupsResponse.data);
                setEnrollmentGroups(enrollmentGroupsResponse.data);

                const classWithSubjectID = getClassBySubjectID(id, classesResponse.data);
                setClassWithSubject(classWithSubjectID);

                if (classWithSubjectID) {
                    const studentClass = getUsersByClassID(classWithSubjectID.id, enrollmentResponse.data, usersResponse.data);
                    setStudentClass(studentClass);
                }
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const getClassBySubjectID = (subjectID, classes) => {
        return classes.find(cls => cls.subjectID === subjectID);
    };

    const getUsersByClassID = (classID, enrollments, users) => {
        const enrolledUsers = enrollments.filter(enroll => enroll.classID === classID);
        return enrolledUsers.map(enroll => users.find(user => user.id === enroll.userID));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    

    const createAndDistributeGroups = async (numberOfGroups, slot) => {
        const newGroups = [];
        const newEnrollmentGroups = [];

        // Create new groups
        for (let i = 1; i <= numberOfGroups; i++) {
            const group = {
                id: groups.length + i,
                name: `Group ${i}`,
                slotID: slot
            };
            newGroups.push(group);
        }

        // Distribute students into groups evenly
        studentClass.forEach((student, index) => {
            const groupID = (index % numberOfGroups) + 1;
            const enrollmentGroup = {
                id: enrollmentGroups.length + index + 1, // Ensure each enrollment group has a unique ID
                groupID: newGroups[groupID - 1].id,
                userID: student.id
            };
            newEnrollmentGroups.push(enrollmentGroup);
        });

        try {
            // Post each new group and update state
            for (const group of newGroups) {
                const response = await axios.post('http://localhost:9999/group', group);
                setGroups(prevGroups => [...prevGroups, response.data]); // Assuming response contains the created group with ID
            }

            // Post each new enrollment group and update state
            for (const enrollmentGroup of newEnrollmentGroups) {
                const response = await axios.post('http://localhost:9999/enrollmentgroup', enrollmentGroup);
                setEnrollmentGroups(prevEnrollmentGroups => [...prevEnrollmentGroups, response.data]); // Assuming response contains the created enrollment group with ID
            }

            alert('Created groups successfully!');
        } catch (err) {
            console.error('Error creating groups or enrollment groups:', err);
            // Implement error handling based on your application's requirements
        }
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid>
            <Row>
                <Col md={isSidebarOpen ? 2 : 1} className="p-0">
                    <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </Col>
                <Col md={isSidebarOpen ? 10 : 11}>
                    <Row className='mt-3'>
                        <Col style={{ display: 'flex' }}>
                            <h5
                                style={{ color: '#297FFD', cursor: 'pointer', marginRight: '10px' }}
                                onClick={() => navigate('/')}
                            >
                                Home
                            </h5>
                            <h5>/</h5>
                            <h5 style={{ margin: '0px 10px' }}>{subjects.code} ↔ {subjects.name}</h5>
                        </Col>
                    </Row>

                    <Row className="mt-3 align-items-center">
                        <Col md={2} style={{ paddingRight: '5px' }}>
                            <p style={{ marginBottom: '0', color: '#297FFD', fontWeight: 'bold' }}>Filter activities</p>
                            <DropdownButton
                                id="dropdown-basic-button"
                                title="All Activities"
                                variant="light"
                            >
                                <Dropdown.Item eventKey="All Activities">All Activities</Dropdown.Item>
                                <Dropdown.Item eventKey="Hidden">Hidden</Dropdown.Item>
                                <Dropdown.Item eventKey="On Going">On Going</Dropdown.Item>
                                <Dropdown.Item eventKey="Cancelled">Cancelled</Dropdown.Item>
                                <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
                                <Dropdown.Item eventKey="Not Started">Not Started</Dropdown.Item>
                                <Dropdown.Item eventKey="Assignment or Feedback">Assignment or Feedback</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                        <Col md={2} className='mr-1' style={{ paddingLeft: '5px' }}>
                            <p style={{ marginBottom: '0', color: '#297FFD', fontWeight: 'bold' }}>Jump slots</p>
                            <DropdownButton
                                id="dropdown-slot-button"
                                title="Select Slot"
                                variant="light"
                            >
                                {
                                    classes.map((cls) => {
                                        const filteredSlots = slots.filter((slot) => slot.classID == cls.id);
                                        if (cls.subjectID == subjects.id && filteredSlots.length > 0) {
                                            return filteredSlots.map((slot, index) => (
                                                <Dropdown.Item key={slot.id} eventKey={slot.id} onClick={() => setSelectedSlotID(slot.id)}>Slot {index + 1}</Dropdown.Item>
                                            ));
                                        }
                                        return null;
                                    })
                                }
                            </DropdownButton>
                        </Col>
                        <Col md={2} style={{ paddingLeft: '5px' }}>
                            <p style={{ marginBottom: '0', color: '#297FFD', fontWeight: 'bold' }}>Class name</p>
                            <DropdownButton
                                id="dropdown-class-button"
                                title="My Class"
                                variant="light"
                            >
                                {
                                    classes.map((cls) => {
                                        const semester = semesters.find((item) => item.id == subjects.semesterID);
                                        if (cls.subjectID == subjects.id && semester) {
                                            return <Dropdown.Item key={cls.id}>{cls.className} - {subjects.code} - APHL - {semester.name}</Dropdown.Item>
                                        }
                                        return null;
                                    })
                                }
                            </DropdownButton>
                        </Col>
                        <Col md={5}>
                            <Button style={{ marginTop: '25px', marginRight: '10px' }} variant="primary" className="custom-button">LEARNING MATERIALS</Button>
                            <Button style={{ marginTop: '25px' }} variant="primary" className="custom-button">ASSIGNMENTS</Button>
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        <p style={{ color: 'black', cursor: 'pointer', fontSize: '12px', fontWeight: '-moz-initial' }}>
                            TEACHERS: <span />
                            {
                                classes.map((cls) => {
                                    const user = users.find((user) => user.id == cls.id);
                                    if (user && cls.subjectID == subjects.id) {
                                        return user.fullname;
                                    }
                                    return null;
                                })
                            }
                        </p>
                    </Row>

                    <Row className='mt-3'>
                        <Col>
                            <Accordion>
                                {
                                    classes.map((cls) => {
                                        if (cls.subjectID == subjects.id) {
                                            const filteredSlots = slots.filter((slot) => slot.classID == cls.id);
                                            return filteredSlots.map((slot, index) => (
                                                <Accordion.Item key={slot.id} eventKey={`${cls.id}-${index}`}>
                                                    <Accordion.Header>
                                                        <div className="d-flex justify-content-between w-100">
                                                            <span>Slot {index + 1}: {slot.slotName}</span>
                                                            {
                                                                roleName == 'Teacher' && (
                                                                    <>
                                                                        <a style={{ color: '#297FFD', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate(`/setSlot/${userId}/${slot.id}/${subjects.code}`)} >Setting slot</a>
                                                                        {/* <a >CREATE GROUP</a> */}
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </Accordion.Header>

                                                    <Accordion.Body>
                                                        <p>Due to: {formatDate(slot.createAt)}</p>
                                                        <p>{slot.detail}</p>
                                                        {roleName == 'Teacher' && (
                                                            groups.find((group) => group.slotID == slot.id) ? <p><strong>{groups.filter((group) => group.slotID == slot.id).length} Groups</strong></p> :
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={() => {
                                                                        setShowModal(true);
                                                                        setSelectedSlotID(slot.id);
                                                                        console.log(slot.id);
                                                                    }}
                                                                >
                                                                    Create Groups
                                                                </Button>
                                                        )}

                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>QUESTION</th>
                                                                    <th>STATUS</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {questions.filter((question) => question.slotID === slot.id && question.status).map((question) => (
                                                                    <tr key={question.id}>
                                                                        <td>
                                                                            <a href={`/question/${question.id}/${subjects.id}/${slot.id}`}>
                                                                                <FaQuestionCircle /> {question.title}
                                                                            </a>
                                                                        </td>
                                                                        <td>
                                                                            <span className="text-danger">Custom</span>
                                                                            <span style={{ marginLeft: '20px', border: '1px solid black', backgroundColor: '#skyblue', border: 'none' }} className="text-primary">On-going</span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            ));
                                        }
                                        return null;
                                    })
                                }
                            </Accordion>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <CreateGroupModal
                show={showModal}
                onHide={() => setShowModal(false)}
                slotID={selectedSlotID}
                onCreateGroups={createAndDistributeGroups}
                studentClass={studentClass}
            />
        </Container>
    );
}

export default CourseDetail;
