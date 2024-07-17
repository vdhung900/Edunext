import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Button, Dropdown, Card, Breadcrumb, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '../components/SideBar';
import axios from 'axios';
import { FiBookOpen, FiMessageSquare } from 'react-icons/fi';
import { FaBook, FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';

function SettingSlot() {
    const { uid, sid, subid } = useParams();
    const navigate = useNavigate();

    const [slot, setSlot] = useState({});
    const [questions, setQuestions] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const slotResponse = await axios.get(`http://localhost:9999/slots/${sid}`);
                const questionsResponse = await axios.get('http://localhost:9999/questions');
                const semestersResponse = await axios.get('http://localhost:9999/semesters');
                const classesResponse = await axios.get('http://localhost:9999/classes');
                setSlot(slotResponse.data);
                setQuestions(questionsResponse.data);
                setSemesters(semestersResponse.data);
                setClasses(classesResponse.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [sid]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const [addQuestion, setAddQuestion] = useState({
        id: '',
        title: '',
        content: '',
        subjectCode: subid,
        slotID: sid,
        status: true,
        lectureID: uid,
        createdAt: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddQuestion({
            ...addQuestion,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const questionID = { ...addQuestion, id: questions.length + 1 };
            await axios.post('http://localhost:9999/questions', questionID);
            alert('Add Question Success');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={isSidebarOpen ? 2 : 1} className="p-0">
                    <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </Col>
                <Col md={isSidebarOpen ? 10 : 11}>
                    <Row className="mt-3">
                        <Col>
                            <Breadcrumb>
                                <Breadcrumb.Item onClick={() => navigate(`/`)}>Home</Breadcrumb.Item>
                                <Breadcrumb.Item active>Slot {sid}</Breadcrumb.Item>
                                <Breadcrumb.Item active>{slot.detail}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <span style={{fontSize: '16px'}}>SHOW <span style={{ color: '#297FFD', fontSize: '16px', paddingLeft: '3px' }}>INFO SESSION</span></span>
                            <span style={{ color: '#297FFD', fontSize: '18px', paddingLeft: '3px' }}>↑↓</span>
                        </Col>
                    </Row>

                    <Row className='mt-3'>
                        <Col>
                            <span><FaCalendarAlt /> {slot.createAt}</span>
                            <span style={{paddingLeft: '18px'}}><FaBook /><span style={{paddingLeft: '5px'}}>{subid}</span></span>
                            <span style={{paddingLeft: '18px'}}><FaChalkboardTeacher />
                            {
                            classes.map((classItem) => {
                                if(classItem.id == slot.classID){
                                    return <span style={{paddingLeft: '5px'}}>{classItem.className}</span>
                                }
                            })
                        }
                            </span>
                        </Col>

                    </Row>

                    <Row className="mt-5">
                        <Col>
                            <Card>
                                <Card.Header className="d-flex  align-items-center">
                                    <span style={{ color: '#297FFD' }}>CONTENT</span>
                                    <span style={{ marginLeft: '10px' }}>STUDENT</span>
                                </Card.Header>
                                <Card.Body>
                                    {questions.map((question) => {
                                        if (question.slotID == sid) {
                                            return (
                                                <Card key={question.id} className="mb-3">
                                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                                        <Card.Text>
                                                            <FiMessageSquare
                                                                style={{ color: 'orange', marginRight: '10px' }}
                                                            />{' '}
                                                            {question.title}
                                                        </Card.Text>
                                                        <div>
                                                            <Button variant="outline-primary" className="me-2">
                                                                HIDE
                                                            </Button>
                                                            <Button variant="primary">START</Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            );
                                        }
                                    })}
                                    <Card.Body className="d-flex justify-content-start align-items-center">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                                Select activity
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item >Reading</Dropdown.Item>
                                                <Dropdown.Item >Feedback</Dropdown.Item>
                                                <Dropdown.Item >Assignment</Dropdown.Item>
                                                <Dropdown.Item >Constructive question</Dropdown.Item>
                                                <Dropdown.Item >Cq question with topic</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Button variant="outline-primary" className="ms-2" onClick={handleShow}>
                                            + ADD NEW
                                        </Button>
                                    </Card.Body>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Modal show={showModal} onHide={handleClose} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formSlotId">
                                            <Form.Label>Slot ID</Form.Label>
                                            <Form.Control type="text" value={addQuestion.slotID} readOnly />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formLectureID">
                                            <Form.Label>Lecture ID</Form.Label>
                                            <Form.Control type="text" value={addQuestion.lectureID} readOnly />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formSubjectCode">
                                            <Form.Label>Subject Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subjectCode"
                                                value={addQuestion.subjectCode} readOnly
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formTitle">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="title"
                                                value={addQuestion.title}
                                                onChange={handleChange}
                                                placeholder="Enter title"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3" controlId="formContent">
                                            <Form.Label>Content</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="content"
                                                value={addQuestion.content}
                                                onChange={handleChange}
                                                placeholder="Enter content"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formStatus">
                                            <Form.Label>Status</Form.Label> <br />
                                            <Form.Check type="checkbox" label="Yes" value={true} inline />
                                            <Form.Check type="checkbox" label="No" value={false} inline />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formCreatedAt">
                                            <Form.Label>Created At</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="createdAt"
                                                value={addQuestion.createdAt}
                                                onChange={handleChange}
                                                placeholder="Enter creation date"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
}

export default SettingSlot;
