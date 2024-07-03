import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FQA = ({ show, handleClose }) => {
return (
    <Modal show={show} onHide={handleClose} size='lg' style={{height: '600px', marginTop: '40px'}}>
    <Modal.Header closeButton>
        <Modal.Title>FQA</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <h1 style={{fontSize: '20px'}}>If the login displays the message "AN ERROR HAS OCCURRED," please verify the system's time settings according to GMT+07:00.</h1>
        <p style={{color: 'red', fontStyle: 'italic'}}>Hãy chắc chắn rằng thời gian trên đồng hồ của hệ thống (LAPTOP hoặc PC) đồng nhất với thời gian hiện tại. (Hãy xem đồng hồ trên điện thoại của bạn để xác nhận lại với PC hoặc LAPTOP)</p>
        <ul>
            <li>
                Checking and change time of laptop or pc to current times <br/>
                <span style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>How to setting</span><br/>
                <img src='/FAQ_1.png'/>
            </li>
            <li>
                 Setting times <br/>
                 <img style={{width: '700px', margin: '0 auto'}} src='/FAQ_2.png'/>
            </li>
        </ul>
        <h1 style={{fontSize: '20px'}}>Why students can not find a classroom - (Not exist account)</h1>
        <ul>
            <li>Because students are added to the class late, students should ask the instructor to add students to the classroom</li>
            <li>The lecturer must click <span style={{color: 'red'}}>"UPDATE STUDENT LIST, TIMETABLE"</span> to sync students for a classroom</li>
            <img style={{width: '700px'}} src='/FAQ_3.png'/>
        </ul>
        <h1 style={{fontSize: '20px'}}>Why lecturer can not change the setting of a CQ?</h1>
        <ul>
            <li>Default "CQs" received from FAP which, lecturer cannot be changed</li>
            <li>The lecturer only changes the settings for "CQs" created by the lecturer himself</li>
        </ul>
        <h1 style={{fontSize: '20px'}}>How to create group for slot?</h1>
        <ul>
            <li>Groups created for a "CQ" in the same "Slot" will be assigned to all "CQs" in the same "Slot" so lecturer only need to create groups once per "Slot".</li>
            <li>To create a group of a "Slot" lecturer must click on the <span style={{color: 'red'}}>"View detail"</span> then selected "CQ" and click on the "CREATE GROUP" button.</li>
        </ul>
        <img style={{width: '750px'}} src = '/FAQ_4.png'/> <br/>
        <img style={{width: '750px'}} src = '/FAQ_5.png'/> <br/>
        <img style={{width: '750px'}} src = '/FAQ_6.png'/>
    </Modal.Body>
    <Modal.Footer>
        <Button style={{color: 'blue'}} variant='light' onClick={handleClose}>
            Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
        OK
        </Button>
    </Modal.Footer>
    </Modal>
);
};

export default FQA;
