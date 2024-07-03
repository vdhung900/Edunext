// Discuss.js
import React, { useState } from 'react';
import { Avatar, Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Discuss = ({ answers, onSend, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editId, setEditId] = useState(null);

    const handleMenuClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setEditId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setEditId(null);
    };

    const handleEdit = (answer) => {
        setEditContent(answer.content);
        onEdit(answer);
        handleMenuClose();
    };

    const handleDelete = (answer) => {
        onDelete(answer);
        handleMenuClose();
    };

    const handleSaveEdit = (id) => {
        onSend(editContent, id);
        setEditId(null);
        setEditContent('');
    };

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
                        <Box sx={{ marginLeft: 'auto' }}>
                            <IconButton onClick={(event) => handleMenuClick(event, answer.id)}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl) && editId == answer.id}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => handleEdit(answer)}>
                                    <EditIcon /> Edit
                                </MenuItem>
                                <MenuItem onClick={() => handleDelete(answer)}>
                                    <DeleteIcon /> Delete
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                    {editId == answer.id ? (
                        <Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <Button onClick={() => handleSaveEdit(answer.id)}>Save</Button>
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
        </div>
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

export default Discuss;
