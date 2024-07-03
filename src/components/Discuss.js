// Discuss.js
import React, { useState } from 'react';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography } from '@mui/material';

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

export default Discuss;
