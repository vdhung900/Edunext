import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SideNav from '../components/SideNav';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../components/styles.css';
import { MdOutlineAssignment } from "react-icons/md";


function AssignmentDetail() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/assignments/${id}`);
                setAssignment(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async () => {
        try {
            console.log('Sending data to server...');
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };
    return (
        <Container fluid>
            <Row>
                <Col md={2} className="sidebar bg-light">
                    <SideNav />
                </Col>
                <Col md={7} className="main-content">
                    <div className="main-content">
                        <div >
                            <h2 style={{ fontSize: '25px', fontWeight: '600' }}>(Assignment) {assignment.content}</h2>
                            <div className="content-box">
                                <div className="content">
                                    <h4 style={{ fontWeight: '500' }}>Content</h4>
                                    <hr />
                                    <p>{assignment.content}</p>
                                </div>
                            </div><br />
                            <p>
                                <strong>ADDITIONAL FILES </strong> <br />
                                <strong>Due Date:</strong> {assignment.date}(GMT+7) - <strong> SCORE(Điểm Số của bạn):0 </strong><br />
                            </p>

                            <hr className="content" />
                            <Row>
                                <Col md={2}>
                                    <div className="content-box">
                                        <div className="content" >
                                            <h4 style={{ fontSize: '20px' }}>SUBMIT STATUS</h4>
                                            <p className="content-box1">Missing</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="content-box">
                                        <div className="content" >
                                            <h4 style={{ fontSize: '20px' }}>SUBMIT TIME</h4>
                                            <p>(GMT+07)</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="content-box">
                                        <div className="content" >
                                            <h4 style={{ fontSize: '20px' }}>LINK/FILE ASSIGNMENT</h4>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <Col>
                        <Button variant="primary" onClick={handleSubmit}>
                            SUBMIT ASSIGNMENT
                        </Button>
                        {submitted && <p>Assignment submitted successfully!</p>}
                    </Col>
                </Col>

                <Col md={3} style={{ marginTop: '85px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                        Table of contents
                    </h2>
                    <div>
                        <h6 className="text-size"> QUESTIONS</h6>
                    </div>
                    <div>
                        <h6 className="text-size">ASSIGNMENT</h6>
                        <p className="text-content"><MdOutlineAssignment />
                            {`${assignment.content}   N/A`}</p>
                    </div>

                </Col>

            </Row>
        </Container>
    );
}

export default AssignmentDetail;
