import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import SideBar from '../components/SideBar';
import '../components/styles.css';
import { AuthContext } from '../context/AuthContext';
import AssignmentSubmit from '../components/AssignmentSubmit';
import CreateAssignment from '../components/CreateAssignment';

function Assignment() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState({});
    const [submissions, setSubmissions] = useState([]);
    const [users, setUsers] = useState([]); // Store users for fullname lookup
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { userId, roleName } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [hasSubmission, setHasSubmission] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!userId) {
        navigate('/login');
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
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

    const handleOpenEditModal = () => {
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };


    const handleDeleteAssignment = async () => {
        try {
            // Fetch all submissions related to the assignment
            const submissionsResponse = await axios.get(`http://localhost:9999/submissions/?assignmentID=${id}`);
            const submissionsToDelete = submissionsResponse.data;
    
            // Delete each submission
            await Promise.all(submissionsToDelete.map(sub => 
                axios.delete(`http://localhost:9999/submissions/${sub.id}`)
            ));
    
            // Now delete the assignment
            await axios.delete(`http://localhost:9999/assignments/${id}`);
            navigate('/'); // Redirect after deletion
        } catch (error) {
            console.error('Error deleting assignment and submissions:', error);
        }
    };

    const handleUpdateScore = async (submissionId, newScore) => {
        try {
            await axios.patch(`http://localhost:9999/submissions/${submissionId}`, { score: newScore });
            setSubmissions((prev) => prev.map(sub => sub.id === submissionId ? { ...sub, score: newScore } : sub));
        } catch (error) {
            console.error('Error updating score:', error);
        }
    };

    const toggleAssignmentVisibility = async () => {
        try {
            const updatedStatus = !assignment.status;
            await axios.patch(`http://localhost:9999/assignments/${id}`, { status: updatedStatus });
            setAssignment((prev) => ({ ...prev, status: updatedStatus }));
        } catch (error) {
            console.error('Error updating assignment status:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assResponse = await axios.get(`http://localhost:9999/assignments/${id}`);
                setAssignment(assResponse.data);

                let submissionsResponse;
                if (roleName === "Teacher") {
                    submissionsResponse = await axios.get(`http://localhost:9999/submissions/?assignmentID=${id}`);
                    setSubmissions(submissionsResponse.data);
                    setHasSubmission(submissionsResponse.data.length > 0);
                } else {
                    submissionsResponse = await axios.get(`http://localhost:9999/submissions?userID=${userId}`);
                    const subassign = submissionsResponse.data.filter(sub => sub.assignmentID == id);
                    setSubmissions(subassign);
                    setHasSubmission(subassign.length > 0);
                }

                const usersResponse = await axios.get('http://localhost:9999/users');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id, userId, roleName]);

    const handleGetAssignment = () => {
        if (assignment.link) {
            window.location.href = assignment.link;
        }
    };

    const getSubmissionStatus = (submissionId) => {
        const submission = submissions.find(sub => sub.id === submissionId);
        if (!submission) {
            return "Missing";
        }
    
        const submissionDate = new Date(submission.createdAt);
        const assignmentDate = new Date(assignment.date);
        return submissionDate <= assignmentDate ? "Done" : "Late";
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
                                    <b>ADDITIONAL FILES:</b>
                                    <button className="btn btn-success" onClick={handleGetAssignment}>
                                        GET ASSIGNMENT
                                    </button>
                                </p>
                                <p>
                                    <b>DUE DATE:</b> {formatDate(assignment.date)}
                                    {roleName === "Student" && (
                                        <>
                                            - <b>SCORE:</b> <span className="red-score">{submissions.length > 0 ? submissions[0].score : 0}</span>
                                        </>
                                    )}
                                </p>
                            </div>
                            {roleName === "Teacher" && (
                                <>
                                    <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                                        Delete Assignment
                                    </Button>
                                    <Button
                                        variant={assignment.status ? "primary" : "secondary"}
                                        onClick={toggleAssignmentVisibility}
                                        style={{ marginTop: '10px' }}
                                    >
                                        {assignment.status ? "Hide Assignment" : "Show Assignment"}
                                    </Button>
                                    <Button variant="primary" onClick={handleOpenEditModal}>
                                Edit Assignment
                            </Button>
                                </>
                            )}
                        </div>
                        <br />

                        {roleName === "Student" && (
                            <div className="submission-tiles">
                                <div className="submission-tile">
                                    <h5>SUBMISSION STATUS</h5>
                                    <br />
                                    <p>{getSubmissionStatus(submissions.length > 0 ? submissions[0].id : null)}</p>
                                </div>
                                <div className="submission-tile">
                                    <h5>SUBMISSION TIME</h5>
                                    <br />
                                    <p>{submissions.length > 0 ? formatDate(submissions[0].createdAt) : '-'}</p>
                                </div>
                                <div className="submission-tile">
                                    <h5>LINK/FILE ASSIGNMENT</h5>
                                    <br />
                                    {submissions.length > 0 && (
                                        <p>
                                            <a href={submissions[0].submitted} download>GET MY FILE</a>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="submission-button">
                            <br></br>
                            {roleName === "Student" && (
                                <Button variant="primary" onClick={handleOpenSubmitModal}>Submit</Button>
                            )}
                        </div>

                        {roleName === "Teacher" && (
                            <>
                                <h4 className="mt-4">Submissions</h4>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Submitted Link</th>
                                            <th>Description</th>
                                            <th>Uploaded Date</th>
                                            <th>Score</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map(sub => {
                                            const user = users.find(user => user.id == sub.userID);
                                            return (
                                                <tr key={sub.id}>
                                                    <td>{user ? user.fullname : 'Unknown User'}</td>
                                                    <td>
                                                        <Button variant="success" onClick={() => window.open(sub.submitted)}>
                                                            Get Link
                                                        </Button>
                                                    </td>
                                                    <td>{sub.description}</td>
                                                    <td>{formatDate(sub.createdAt)}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="10"
                                                            defaultValue={sub.score}
                                                            onChange={(e) => handleUpdateScore(sub.id, e.target.value)}
                                                        />
                                                    </td>
                                                    <td>{getSubmissionStatus(sub.id)}</td>
                                                    <td>
                                                        <Button variant="primary" onClick={() => handleUpdateScore(sub.id, sub.score)}>
                                                            Update
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </>
                        )}
                    </div>
                </Col>
            </Row>
            <CreateAssignment show={showEditModal} handleClose={handleCloseEditModal} userId={userId} editID={id} />
            <AssignmentSubmit
                show={showSubmitModal}
                handleClose={handleCloseSubmitModal}
                assignmentDate={assignment.createdAt}
                assignmentID={assignment.id}
                submissionId={submissions.length > 0 ? submissions[0].id : null}
                uId={userId}
                hasSubmission={hasSubmission}
            />
            {showDeleteConfirm && (
                <div className="confirmation-modal">
                    <h5>Are you sure you want to delete this assignment?</h5>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteAssignment}>Confirm</Button>
                </div>
            )}
        </Container>
    );
}

export default Assignment;
