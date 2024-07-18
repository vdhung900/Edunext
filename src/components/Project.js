import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap';
import SideBar from './SideBar';

function Project() {
    const [semesters, setSemesters] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const semestersResponse = await axios.get('http://localhost:9999/semesters');
                setSemesters(semestersResponse.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (

        <Container fluid>
            <Row>
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
                        >
                            <option value="">Trial</option>
                            {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>{semester.name}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Form.Group>
            </Row>

            <Row className="justify-content-md-center mt-3">
                <img style={{ width: '300px' }} src='/Box.png' />
                <p style={{ color: '#0078D4', textAlign: 'center', fontSize: '20px', paddingTop: '20px' }}>No data available.</p>
                <p style={{ textAlign: 'center', fontSize: '24px' }}>Please contact your school administration for more information.</p>
            </Row>


        </Container>
    )
}

export default Project