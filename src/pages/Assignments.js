import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { PiComputerTower } from "react-icons/pi";
import { IoTimeOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import axios from 'axios';
import SideNav from '../components/SideNav';
import { Link } from 'react-router-dom'; 

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9999/assignments');
            setAssignments(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredAssignments = selectedContent
        ? assignments.filter(assignment => assignment.content === selectedContent)
        : assignments;

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="sidebar bg-light">
                    <SideNav />
                </Col>
                <Col md={10}>
                    <Row>
                        {filteredAssignments.map((assignment) => (
                            <Col key={assignment.id} md={3} className="mb-4">
                                <Card className="h-100 d-flex flex-column justify-content-between">
                                    <Card.Body>
                                        <Card.Title style={{ height: '50px' }}>{assignment.content}</Card.Title>
                                        <Card.Title style={{ height: '30px' }}>Slot: {assignment.slotID}</Card.Title>

                                        <Card.Text>
                                            <PiComputerTower style={{ fontSize: '24px', color: 'grey', marginRight: '8px' }} />
                                            Subject: {assignment.classID}
                                        </Card.Text>
                                        <Card.Text>
                                            <SiGoogleclassroom style={{ fontSize: '24px', color: 'grey', marginRight: '8px' }} />
                                            Class: {assignment.subjectCode}
                                        </Card.Text>
                                        <Card.Text>
                                            <IoTimeOutline style={{ fontSize: '24px', color: 'grey', marginRight: '8px' }} />
                                            Due Date: {assignment.date}(GMT+7)
                                        </Card.Text>
                                    </Card.Body>

                                    <Card.Footer className="d-flex justify-content-between">
                                        <Link to={`/assignment/${assignment.id}`} className="btn btn-primary">
                                            View Assignment
                                        </Link>
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

export default Assignments;
