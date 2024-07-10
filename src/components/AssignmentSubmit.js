import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const AssignmentSubmit = ({ show, handleClose, assignmentDate, assignmentID, submissionId, uId, hasSubmission }) => {
    const [description, setDescription] = useState('');
    const [submissionLink, setSubmissionLink] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [linkError, setLinkError] = useState('');

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


    useEffect(() => {
        if (hasSubmission) {
            // Fetch submission details if submission exists
            axios.get(`http://localhost:9999/submissions/${submissionId}`)
                .then(response => {
                    setDescription(response.data.description);
                    setSubmissionLink(response.data.submitted);
                })
                .catch(error => {
                    console.error('Error fetching submission details:', error);
                });
        }
    }, [hasSubmission, submissionId]);

    const handleSubmit = () => {
        // Validation checks
        if (description.length > 255) {
            setDescriptionError('Miêu tả không quá 255 kí tự');
            return;
        } else {
            setDescriptionError('');
        }

        if (!isValidUrl(submissionLink)) {
            setLinkError('Đây không phải là một link https');
            return;
        } else {
            setLinkError('');
        }

        // Prepare data for POST or PUT
        const submissionData = {
            assignmentID: assignmentID,
            submitted: submissionLink,
            description: description,
            date: new Date().toISOString(),
            userID: uId, // Replace with actual user ID
            score: 0
        };

        console.log(submissionData);

        if (hasSubmission) {
            // Perform PUT request to update existing submission
            axios.put(`http://localhost:9999/submissions/${submissionId}`, submissionData)
                .then(response => {
                    console.log('Submission updated successfully:', response.data);
                    handleClose();
                    // After submission is successful, reload the page
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error updating submission:', error);
                });
        } else {
            // Perform POST request to create new submission
            axios.post('http://localhost:9999/submissions', submissionData)
                .then(response => {
                    console.log('New submission created successfully:', response.data);
                    handleClose();
                    // After submission is successful, reload the page
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error creating new submission:', error);
                });
        }
    };

    const isValidUrl = (url) => {
        // Simple URL validation for https URLs
        return /^https:\/\/.+$/.test(url);
    };

    return (
        <Modal show={show} onHide={handleClose} size='lg' style={{ height: '800px', marginTop: '40px' }}>
            <Modal.Header closeButton>
                <Modal.Title>SUBMISSION</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="submissionLink">
                        <Form.Label>Submission Link</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={hasSubmission ? '' : 'Submit your work here'}
                            value={submissionLink}
                            onChange={(e) => setSubmissionLink(e.target.value)}
                            isInvalid={linkError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">{linkError}</Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder={hasSubmission ? '' : 'Short Description'}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            isInvalid={descriptionError !== ''}
                        />
                        <Form.Control.Feedback type="invalid">{descriptionError}</Form.Control.Feedback>
                    </Form.Group>
                    <br></br>
                    <Alert variant="warning">
                        <p><strong>Warning:</strong></p>
                        <p>- Description should not be more than 255 characters (Miêu tả không quá 255 kí tự)</p>
                        <p>- Please input a proper https URL (Xin hãy điền đúng một https URL)</p>
                    </Alert>
                    <p>Due Date: <span style={{ color: 'red' }}>{formatDate(assignmentDate)}</span></p>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='light' onClick={handleClose}>Close</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AssignmentSubmit;
