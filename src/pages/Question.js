import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Box, TextField, Paper, Typography, Avatar, Button } from '@mui/material';
import axios from 'axios';
import '../components/styles.css';
import SideNav from '../components/SideNav';
import { Container, Row, Col } from 'react-bootstrap';
import { FaRegComments } from 'react-icons/fa';

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
    // Format timestamp
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0 nên cần +1
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
                                {/* <Tab label="Grade" value="grade" /> */}
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

function Group() {
    return (
        <div>
            <h2>Group</h2>
            <p>Group content goes here</p>
        </div>
    );
}

const Discuss = ({ answers, onSend }) => {
    return (
        <div>
            <h2>Discuss</h2>
            <TextBox onSend={onSend} />
            {answers.map((answer) => (
                <Paper key={answer.id} sx={{ padding: '20px', margin: '20px 0', borderRadius: '10px', boxShadow: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', marginRight: '10px' }}>A</Avatar>
                        <Box>
                            <Typography variant="subtitle1"><b>{answer.userID}</b></Typography>
                            <Typography variant="body2" color="textSecondary">{answer.timestamp}</Typography>
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{ marginBottom: '10px', marginLeft: '14px' }}>
                        {answer.content}
                    </Typography>
                    <Box>
                        <Button size="small">Vote</Button>
                    </Box>
                </Paper>
            ))}
        </div>
    );
};

const TeacherMessage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'grey',
                marginTop: '20px',
            }}
        >
            <FaRegComments size={40} />
            <Typography variant="h6" sx={{marginLeft: '10px', fontWeight: 500 }}>
                THERE ARE NO COMMENTS!
            </Typography>
        </Box>
    );
};


const TextBox = ({ onSend }) => {
    const [answerContent, setAnswerContent] = useState('');

    const handleSend = () => {
        if (answerContent.trim()) {
            onSend(answerContent);
            setAnswerContent('');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                backgroundColor: 'white',
                borderRadius: '10px',
                marginBottom: '20px',
            }}
        >
            <TextField
                sx={{ flex: 1, width: '100%', marginBottom: '10px' }}
                InputProps={{
                    style: { color: 'black' },
                }}
                placeholder="Type your message here..."
                multiline
                rows={4}
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSend}>
                Send
            </Button>
        </Box>
    );
};

