import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, CircularProgress, Grid } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import SideBar from '../components/SideBar';
import { FaBook, FaRegClock, FaChalkboardTeacher  } from "react-icons/fa";

const List_Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [classNames, setClassNames] = useState({});
    const [subjectMap, setSubjectMap] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    if (!userId) {
        navigate('/login');
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => {
        const fetchClassAndSubjectDetails = async () => {
            try {
                const classResponse = await axios.get('http://localhost:9999/classes');
                const classMap = classResponse.data.reduce((acc, cls) => {
                    acc[cls.id] = cls.className;
                    return acc;
                }, {});

                const subjectResponse = await axios.get('http://localhost:9999/subjects');
                const subjectMap = subjectResponse.data.reduce((acc, subject) => {
                    acc[subject.code] = subject.id;
                    return acc;
                }, {});

                setClassNames(classMap);
                setSubjectMap(subjectMap);
            } catch (error) {
                console.error('Failed to fetch class and subject details', error);
            }
        };

        const fetchData = async () => {
            try {
                const enrollmentResponse = await axios.get(`http://localhost:9999/enrollment`, {
                    params: { userID: userId },
                });
                const userClassIDs = enrollmentResponse.data.map(enrollment => enrollment.classID);

                await fetchClassAndSubjectDetails();

                const assignmentResponse = await axios.get(`http://localhost:9999/assignments`);
                const filteredAssignments = assignmentResponse.data.filter(assignment => userClassIDs.includes(assignment.classID));

                setAssignments(filteredAssignments);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, navigate]);

    return (
        <Container fluid>
            <Row>
                <Col md={isSidebarOpen ? 2 : 1} className="p-0">
                    <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </Col>
                <Col md={isSidebarOpen ? 10 : 11}>
                    <Box sx={{ padding: '40px' }}>
                        <Typography variant="h4" gutterBottom>
                            Assignments
                        </Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Grid container spacing={2}>
                                {assignments.map((assignment) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={assignment.id}>
                                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0' }}>{assignment.title}</Typography>
                                                <Typography variant="body2" sx={{ marginTop: '0' }}>Slot: {assignment.slotID}</Typography>
                                                <div style={{ color: '#666' }}>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <FaBook fontSize="small" /> 
                                                        Subject: 
                                                        <a href={`/course/${subjectMap[assignment.subjectCode]}`} style={{ color: '#38cb89', textDecoration: 'none' }}>
                                                            <strong>{assignment.subjectCode}</strong>
                                                        </a>
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <FaChalkboardTeacher  fontSize="small" /> Class: {classNames[assignment.classID]}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <FaRegClock fontSize="small" /> Due date: {formatTimestamp(assignment.date)}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                                        <a href={`/assignment/${assignment.id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
                                                            View assignment →
                                                        </a>
                                                    </Typography>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Col>
            </Row>
        </Container>
    );
};

export default List_Assignment;
