import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, DropdownButton, Dropdown, Row, Table, Accordion } from 'react-bootstrap';
import { FaCommentDots, FaQuestionCircle } from 'react-icons/fa';

import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { AuthContext } from '../context/AuthContext';

function CourseDetail() {
    const { id } = useParams();

    const [slots, setSlots] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const slotsResponse = await axios.get('http://localhost:9999/slots');
                const subjectsResponse = await axios.get(`http://localhost:9999/subjects/${id}`);
                const lecturersResponse = await axios.get('http://localhost:9999/lecturer');
                const classesResponse = await axios.get('http://localhost:9999/classes');
                const semestersResponse = await axios.get('http://localhost:9999/semesters');
                const questionsResponse = await axios.get('http://localhost:9999/questions');
                setSlots(slotsResponse.data);
                setSubjects(subjectsResponse.data);
                setLecturers(lecturersResponse.data);
                setClasses(classesResponse.data);
                setSemesters(semestersResponse.data);
                setQuestions(questionsResponse.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                                style={{ textDecoration: 'underline', color: '#297FFD', cursor: 'pointer', marginRight: '10px' }}
                                onClick={() => navigate('/')}
                            >
                                Home
                            </h5>
                            <h5>/ {subjects.code} ↔ {subjects.name} </h5>
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
                                    classes.map((classes) => {
                                        const filteredSlots = slots.filter((slot) => slot.classID == classes.id);
                                        if (classes.subjectID == subjects.id && filteredSlots.length > 0) {
                                            return filteredSlots.map((slot, index) => (
                                                <Dropdown.Item key={slot.id}>Slot {index + 1}</Dropdown.Item>
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
                                    const lecturer = lecturers.find((lecturer) => lecturer.id == cls.lectureID);
                                    if (cls.subjectID == subjects.id && lecturer) {
                                        return lecturer.name;
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
                                                    <Accordion.Header>Slot {index + 1}: {slot.slotName}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <p><strong>{slot.timestamp}</strong></p>
                                                        <p>{slot.detail}</p>
                                                        <Table striped bordered hover>
                                                            <thead>
                                                                <tr>
                                                                    <th>QUESTION</th>
                                                                    <th>STATUS</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    questions.filter((question) => question.slotID == slot.id).map((question) => (
                                                                        <tr key={question.id}>
                                                                             <td><a href={`/question/${question.id}`}><FaQuestionCircle /> {question.title}</a></td>
                                                                            <td>
                                                                                <span className="text-danger">Custom</span>
                                                                                <span style={{ marginLeft: '20px', border: '1px solid black', backgroundColor: '#skyblue', border: 'none' }} className="text-primary">On-going</span>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                }
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
        </Container>
    );
}

export default CourseDetail;
