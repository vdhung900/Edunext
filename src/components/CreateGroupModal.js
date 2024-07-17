import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CreateGroupModal({ show, onHide, slotID, onCreateGroups, studentClass }) {
    const [numberOfGroups, setNumberOfGroups] = useState(1);

    const handleCreateGroups = () => {
        onCreateGroups(numberOfGroups, slotID);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size='lg' style={{ height: '600px', marginTop: '40px' }}>
            <Modal.Header closeButton>
                <Modal.Title>Create Groups</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <strong style={{ color: 'orange' }}>Class size: {studentClass.length}</strong>
                <Form>
                    <Form.Group controlId="formNumberOfGroups">
                        <Form.Label className='text-center'>How many groups do you want to create?</Form.Label>
                        <Form.Control
                            type="number"
                            value={numberOfGroups}
                            onChange={(e) => setNumberOfGroups(e.target.value)}
                            min="1"
                        />
                    </Form.Group>
                </Form>
                <br />
                <strong>Create random groups</strong>
                <br />
                <strong>Step 1:</strong> The system will display the number of students. Type the number of groups to create.
                <br />
                <strong>Step 2:</strong> Click "Next Step" to preview groups with random members. The first member of each group is defaulted as the group leader.
                <br />
                <strong>Step 3:</strong> Click "Finish" to complete creating groups randomly.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={handleCreateGroups}>Next Step</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateGroupModal;