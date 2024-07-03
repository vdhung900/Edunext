import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Tabs, Tab, Box } from '@mui/material';
import axios from 'axios';
import SideNav from '../components/SideNav';
import Discuss from '../components/Discuss';
import Group from '../components/Group';
import TeacherMessage from '../components/TeacherMessage';

function Question() {
    const { id } = useParams();
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    const [currentTab, setCurrentTab] = useState('group');

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
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    const handleSendAnswer = async (content) => {
        try {
            const newAnswer = {
                userID: 'currentUser',
                questionID: Number(id),
                vote: 0,
                content: content,
                timestamp: formatTimestamp(new Date()),
            };
            await axios.post(`http://localhost:9999/answers`, newAnswer);
            setAnswers([...answers, newAnswer]);
        } catch (error) {
            console.error(error);
        }
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'group':
                return <Group />;
            case 'discuss':
                return <Discuss answers={answers} onSend={handleSendAnswer} />;
            case 'teacher-message':
                return <TeacherMessage />;
            default:
                return <Group />;
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="bg-light sidebar">
                    <SideNav />
                </Col>
                <Col md={10} className="main-content">
                    <div className="main-content">
                        <div className="group-component">
                            <h2>(Question) {question.title}</h2>
                            <div className="content-box">
                                <div className="content">
                                    <h4>Content</h4>
                                    <hr />
                                    <p>{question.content}</p>
                                </div>
                            </div>
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
                        {renderContent()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Question;