import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Avatar, Box, Button, Paper, TextField, Typography, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AuthContext } from '../context/AuthContext';

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
            <Button variant="contained" color="primary" onClick={handleSend} disabled={!answerContent.trim()}>
                Send
            </Button>
        </Box>
    );
};

const UserDetail = ({ userID, userDetails }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userDetails[userID]) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`http://localhost:9999/users/${userID}`);
                    const fullname = response.data.fullname;
                    userDetails[userID] = fullname;
                } catch (error) {
                    console.error(`Failed to fetch user details for userID: ${userID}`, error);
                }
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [userID, userDetails]);

    return isLoading ? <CircularProgress size={24} /> : <Typography variant="subtitle1"><b>{userDetails[userID] || userID}</b></Typography>;
};

const Discuss = ({ answers, setAnswers, userId, questionId, formatTimestamp }) => {
    const [userDetails, setUserDetails] = useState({});
    const [editingAnswerId, setEditingAnswerId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);


    const handleSendAnswer = async (content) => {
        try {
            const newAnswer = {
                userID: userId,
                questionID: Number(questionId),
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

    const handleEditAnswer = async (answerId, newContent) => {
        try {
            await axios.put(`http://localhost:9999/answers/${answerId}`, { ...selectedAnswer,content: newContent, timestamp: formatTimestamp(new Date()) });
            alert('Answer updated successfully');
            setAnswers(answers.map(answer => (answer.id === answerId ? { ...answer, content: newContent } : answer)));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        const confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
        try {
            await axios.delete(`http://localhost:9999/answers/${answerId}`);
            alert('Answer deleted successfully');
            setAnswers(answers.filter(answer => answer.id !== answerId));
            handleMenuClose();
        } catch (error) {
            console.error(error);
        }
    }
    };

    const handleMenuOpen = (event, answer) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedAnswer(answer);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedAnswer(null);
    };

    const handleEditClick = () => {
        if (selectedAnswer) {
            setEditingAnswerId(selectedAnswer.id);
            setEditContent(selectedAnswer.content);
            setMenuAnchorEl(null);
        }
    };

    const handleSaveEdit = async () => {
        await handleEditAnswer(editingAnswerId, editContent);
        setEditingAnswerId(null);
        setEditContent('');
    };

    return (
        <div>
            <h2>Discuss</h2>
            <TextBox onSend={handleSendAnswer} />
            {answers.map((answer) => (
                <Paper key={answer.id} sx={{ padding: '20px', margin: '20px 0', borderRadius: '10px', boxShadow: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ border: '1px solid black', marginRight: '10px' }} src='../ava.png'></Avatar>
                            <Box>
                                <UserDetail userID={answer.userID} userDetails={userDetails} />
                                <Typography variant="body2" color="textSecondary">{answer.timestamp}</Typography>
                            </Box>
                        </Box>
                        {answer.userID === userId && (
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={(event) => handleMenuOpen(event, answer)}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </Box>
                    {editingAnswerId === answer.id ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <TextField
                                multiline
                                fullWidth
                                rows={4}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <Button style={{ marginTop: '10px' }} variant="contained" color="primary" onClick={handleSaveEdit}>
                                Save
                            </Button>
                        </Box>
                    ) : (
                        <Typography variant="body1" sx={{ marginBottom: '10px', marginLeft: '14px' }}>
                            {answer.content}
                        </Typography>
                    )}
                    <Box>
                        <Button size="small">Vote</Button>
                    </Box>
                </Paper>
            ))}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={() => handleDeleteAnswer(selectedAnswer.id)}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export default Discuss;
