import React from 'react'
import { Box, Typography } from '@mui/material';
import { FaRegComments } from 'react-icons/fa';

function TeacherMessage() {
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
            <Typography variant="h6" sx={{ marginLeft: '10px', fontWeight: 500 }}>
                THERE ARE NO COMMENTS!
            </Typography>
        </Box>
  )
}

export default TeacherMessage