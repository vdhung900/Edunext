import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Tabs, Tab, Box } from '@mui/material';
import axios from 'axios';
import Discuss from '../components/Discuss';
import Group from '../components/Group';
import TeacherMessage from '../components/TeacherMessage';
import SideBar from '../components/SideBar';
import '../components/styles.css';
import { AuthContext } from '../context/AuthContext';

function Question() {
    const { id, subid, slotid } = useParams();
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    const [currentTab, setCurrentTab] = useState('discuss');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [subject, setSubject] = useState({});
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!userId) {
        navigate('/login');
    }
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const questionResponse = await axios.get(`http://localhost:9999/questions/${id}`);
                setQuestion(questionResponse.data);
                const answersResponse = await axios.get(`http://localhost:9999/answers`, {
                    params: { questionID: id }
                });
                setAnswers(answersResponse.data);
                const subjectResponse = await axios.get(`http://localhost:9999/subjects/${subid}`);
                setSubject(subjectResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);//id, answers, subid

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
                            >Home</h5><h5>/</h5>
                            <h5
                                style={{ color: '#297FFD', cursor: 'pointer', margin: '0px 10px' }}
                                onClick={() => navigate('/course/' + subid)}
                            > {subject.name} </h5><h5>/</h5>
                            <h5 style={{margin: '0px 10px'}}> {question.title} </h5>
                        </Col>
                    </Row>
                    <div className="main-content">
                        <div className="group-component">
                            <h2>(Question) {question.title}</h2><br />
                            <div className="content-box">
                                <div className="content" style={{ marginLeft: '10px' }}>
                                    <h5>Content</h5>
                                    <hr />
                                    <p>{question.content}</p>
                                </div>
                            </div>
                            <br />
                            <p>
                                Discussion time has been started.<br />
                                Students can comment and vote for comments during this time.<br />
                                Current Timezone: You are currently in <b>Asia/Saigon</b> time zone <b>(GMT+7)</b>
                            </p>
                        </div>
                        <Box display="flex" justifyContent="center">
                            <Tabs value={currentTab} onChange={handleChange} aria-label="navigation tabs">
                                <Tab label="Group" value="group" />
                                <Tab label="Discuss" value="discuss" />
                                <Tab label="Teacher's Message" value="teacher-message" />
                            </Tabs>
                        </Box>
                        {currentTab === 'discuss' && (
                            <Discuss
                                answers={answers}
                                setAnswers={setAnswers}
                                userId={userId}
                                questionId={id}
                                formatTimestamp={formatTimestamp}
                            />
                        )}
                        {currentTab === 'group' && <Group slotID={slotid}/>}
                        {currentTab === 'teacher-message' && <TeacherMessage />}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Question;
