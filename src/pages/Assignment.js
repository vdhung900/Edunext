import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import SideBar from '../components/SideBar';
import '../components/styles.css';
import { AuthContext } from '../context/AuthContext';
import AssignmentSubmit from '../components/AssignmentSubmit';

function Assignment() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState({});
    const [submissions, setSubmissions] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [hasSubmission, setHasSubmission] = useState(false); // State to track if there is a submission

    if (!userId) {
        navigate('/login');
    }

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0'); // Ensure two digits
        const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits
        const seconds = date.getSeconds().toString().padStart(2, '0'); // Ensure two digits
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleOpenSubmitModal = () => {
        setShowSubmitModal(true);
    };

    const handleCloseSubmitModal = () => {
        setShowSubmitModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assResponse = await axios.get(`http://localhost:9999/assignments/${id}`);
                setAssignment(assResponse.data);

                const submissionsResponse = await axios.get('http://localhost:9999/submissions');
                const subuser = submissionsResponse.data.filter(submissions => submissions.userID == userId);
                const subassign = subuser.filter(submissions => submissions.assignmentID == id);
                setSubmissions(subassign);

                // Check if there is a submission
                if (subassign.length > 0) {
                    setHasSubmission(true);
                } else {
                    setHasSubmission(false);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id, userId]);

    const handleGetAssignment = () => {
        if (assignment.link) {
            window.location.href = assignment.link;
        }
    };

    const getSubmissionStatus = () => {
        if (submissions.length === 0) {
            return "Missing";
        }

        const submissionDate = new Date(submissions[0].date);
        const assignmentDate = new Date(assignment.date);
        console.log(submissionDate, assignmentDate);

        if (submissionDate <= assignmentDate) {
            return "Done";
        } else {
            return "Late";
        }
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
                                style={{ color: '#297FFD', cursor: 'pointer', marginRight: '10px' }}
                                onClick={() => navigate('/')}
                            >
                                Home
                            </h5>
                            <h5>/ {assignment.subjectCode} - {assignment.title} </h5>
                        </Col>
                    </Row>
                    <div className="main-content">
                        <div className="group-component">
                            <h2>{assignment.title}</h2><br />
                            <div className="content-box">
                                <div className="content" style={{ marginLeft: '10px' }}>
                                    <h5>Content</h5>
                                    <hr />
                                    <p>{assignment.content}</p>
                                </div>
                            </div>
                            <br />
                            <div>
                                <p>
                                    <b>ADDITIONAL FILES:</b> <button className="btn btn-success" onClick={handleGetAssignment}>GET ASSIGNMENT</button>
                                </p>
                                <p>
                                    <b>DUE DATE:</b> {formatDate(assignment.date)} - <b>SCORE:</b> <span className="red-score">{submissions.length > 0 ? submissions[0].score : 0}</span>
                                </p>
                            </div>
                        </div>
                        <br></br>
                        <div className="submission-tiles">
                            <div className="submission-tile">
                                <h5>SUBMISSION STATUS</h5>
                                <br></br>
                                <p>{getSubmissionStatus()}</p>
                            </div>
                            <div className="submission-tile">
                                <h5>SUBMISSION TIME</h5>
                                <br></br>
                                <p>{submissions.length > 0 ? formatDate(submissions[0].date) : '-'}</p>
                            </div>
                            <div className="submission-tile">
                                <h5>LINK/FILE ASSIGNMENT</h5>
                                <br></br>
                                {submissions.length > 0 &&
                                    <p>
                                        <a href={submissions[0].submitted} download>GET MY FILE</a>
                                    </p>
                                }
                            </div>
                        </div>
                        <br></br>
                        <div className="submission-button">
                            <Button variant="primary" onClick={handleOpenSubmitModal}>Submit</Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <AssignmentSubmit
                show={showSubmitModal}
                handleClose={handleCloseSubmitModal}
                assignmentDate={assignment.date}
                assignmentID={assignment.id}
                submissionId={submissions.length > 0 ? submissions[0].id : null}
                uId={userId}
                hasSubmission={hasSubmission}
            />
        </Container>
    );
}

export default Assignment;
