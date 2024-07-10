import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import SideBar from '../components/SideBar';
import '../components/styles.css';
import { AuthContext } from '../context/AuthContext';

function Assignment() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState({});
    const [submissions, setSubmissions] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!userId) {
        navigate('/login');
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assResponse = await axios.get(`http://localhost:9999/assignments/${id}`);
                setAssignment(assResponse.data);

                const submissionsResponse = await axios.get('http://localhost:9000/submissions');
                const subuser = submissionsResponse.data.filter(submissions => submissions.userID == userId);
                const subassign = subuser.filter(submissions => submissions.assignmentID == id);
                setSubmissions(subassign);
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
                                style={{ textDecoration: 'underline', color: '#297FFD', cursor: 'pointer', marginRight: '10px' }}
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
                                    <b>DUE DATE:</b> {assignment.date} {assignment.time} - <b>SCORE:</b> <span className="red-score">{submissions.length > 0 ? submissions[0].score : 0}</span>
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
                                <p>{submissions.length > 0 ? new Date(submissions[0].date).toLocaleString() : '-'}</p>
                            </div>
                            <div className="submission-tile">
                                <h5>LINK/FILE ASSIGNMENT</h5>
                                <br></br>
                                {submissions.length > 0 &&
                                    <p>
                                        {submissions[0].submitted.startsWith('data:') ? (
                                            <a href={submissions[0].submitted} download>GET MY FILE</a>
                                        ) : (
                                            <a href={submissions[0].submitted} target="_blank" rel="noopener noreferrer">GET MY FILE</a>
                                        )}
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Assignment;
