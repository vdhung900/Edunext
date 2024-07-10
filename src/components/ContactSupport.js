import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import { MdOutlineHeight } from 'react-icons/md';

const ContactSupport = ({ show, handleClose }) => {

    return (
        <Modal show={show} onHide={handleClose} size='lg' style={{ height: '600px', marginTop: '40px' }}>
            <Modal.Header>
                <Modal.Title>Contact Support</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h1 style={{ color: 'red', fontSize: '20px' }}>Please refer to 'FQA' before requesting support</h1> <br />
                <h1 style={{ color: 'red', fontSize: '20px' }}>Contact IT: 0913677744. If the request is important</h1> <br />
                <p style={{ fontSize: '15px' }}>Title</p>
                <input style={{ width: '750px', height: '50px' }} type='text' placeholder='Title' />
                <p style={{ fontSize: '15px', marginTop: '25px' }}>Contact information</p>
                <input style={{ width: '750px', height: '50px' }} type='text' placeholder='Contact information (mobile or email) should be provided. You should provide a mobile phone number.' />
                <p style={{ fontSize: '15px', marginTop: '25px' }}>Description</p>
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        toolbar: [
                            'bold', 'italic', 'strikethrough', 'underline', 'link', 'blockquote', 'code', 'horizontalLine', 'imageUpload', 'insertTable', 'mediaEmbed', 'numberedList', 'bulletedList', 'todoList', 'outdent', 'indent', 'undo', 'redo'
                        ],
                        heading: {
                            options: [
                                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                            ]
                        }
                    }}
                />
                <p style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '30px' }}>(*)For word documents: Paste single page per time</p>
            </Modal.Body>
            <Modal.Footer>
                <Button style={{ color: 'blue' }} variant='light' onClick={handleClose}>
                    Close
                </Button>
                <Button>Save</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default ContactSupport