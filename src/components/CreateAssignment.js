import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const CreateAssignment = ({ show, handleClose, userId, editID }) => {
  const [classes, setClasses] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState(true);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await axios.get(`http://localhost:9999/classes/?lectureID=${userId}`);
      const classesData = response.data;

      const classesWithSubjects = await Promise.all(
        classesData.map(async (cls) => {
          const subjectResponse = await axios.get(`http://localhost:9999/subjects/${cls.subjectID}`);
          const subject = subjectResponse.data;
          return {
            id: cls.id,
            className: cls.className,
            subjectCode: subject.code,
            subjectName: subject.name,
          };
        })
      );

      setClasses(classesWithSubjects);
    };

    fetchClasses();
  }, [userId]);

  useEffect(() => {
    if (editID) {
      const fetchAssignment = async () => {
        const response = await axios.get(`http://localhost:9999/assignments/${editID}`);
        const assignmentData = response.data;

        setTitle(assignmentData.title);
        setContent(assignmentData.content);
        setLink(assignmentData.link);
        setStatus(assignmentData.status);
        setDueDate(new Date(assignmentData.date).toISOString().slice(0, 16)); // Format the date
        setSelectedClass(assignmentData.classID);
        setSelectedSlot(assignmentData.slotID);
      };

      fetchAssignment();
    }
  }, [editID]);

  useEffect(() => {
    if (selectedClass) {
      const fetchSlots = async () => {
        const response = await axios.get(`http://localhost:9999/slots/?classID=${selectedClass}`);
        setSlots(response.data || []);
      };

      fetchSlots();
    } else {
      setSlots([]);
    }
  }, [selectedClass]);

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSlot || !title || !content || !dueDate) {
      setError('Please fill in all mandatory fields: Class, Slot, Title, Content, and Due Date.');
      return;
    }

    const selectedDueDate = new Date(dueDate);
    const currentDate = new Date();
    if (selectedDueDate < currentDate) {
      setError('Due Date must be in the future.');
      return;
    }

    const payload = {
      subjectCode: classes.find(c => c.id === selectedClass)?.subjectCode,
      slotID: Number(selectedSlot),
      title,
      content,
      createdAt: new Date().toISOString(),
      date: selectedDueDate.toISOString(),
      classID: Number(selectedClass),
      status,
      lectureID: Number(userId),
      link,
    };

    try {
      if (editID) {
        await axios.put(`http://localhost:9999/assignments/${editID}`, payload);
      } else {
        await axios.post('http://localhost:9999/assignments', payload);
      }
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError('Failed to create or update assignment.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size='lg' style={{ height: '800px', marginTop: '40px' }}>
      <Modal.Header closeButton>
        <Modal.Title>{editID ? 'EDIT ASSIGNMENT' : 'CREATE ASSIGNMENT'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Class</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedClass(e.target.value)}
              value={selectedClass}
              disabled={!!editID}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.className} - {cls.subjectCode} - {cls.subjectName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Slots</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedSlot(e.target.value)}
              value={selectedSlot}
              disabled={!selectedClass || !!editID}
            >
              <option value="">Select Slot</option>
              {slots.map(slot => (
                <option key={slot.id} value={slot.id}>
                  {slot.slotName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              maxLength="255"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Files</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setLink(e.target.value)}
              value={link}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="datetime-local"
              onChange={(e) => setDueDate(e.target.value)}
              value={dueDate}
              required
            />
          </Form.Group>

          <br />
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Label>Status</Form.Label>
            <span>&nbsp;</span>
            <Button variant={status ? 'primary' : 'danger'} onClick={() => setStatus(!status)}>
              {status ? 'Enable' : 'Disable'}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='light' onClick={handleClose}>Close</Button>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateAssignment;
