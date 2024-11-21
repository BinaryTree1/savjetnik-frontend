// Message.jsx
import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Message = ({ text, sender }) => {
  const theme = useTheme();

  return (
    <Box width="100%">
      <Box
        display="flex"
        alignItems="flex-start"
        p={2}
        sx={{
          bgcolor:
            sender === 'user'
              ? theme.palette.mode === 'light'
                ? '#f1f3f5' // Subtle off-white for user messages in light mode
                : theme.palette.background.paper
              : 'transparent',
        }}
      >
        <Box display="flex" width="100%" justifyContent="center">
          <Box
            display="flex"
            alignItems="flex-start"
            gap={2}
            p={1}
            sx={{
              width: {
                xs: '100%', // Full width on extra small screens
                sm: '90%', // 90% width on small screens
                md: '80%', // 80% width on medium screens
                lg: '80%', // 80% width on large screens
                xl: '70%', // 82% width on extra-large screens
              },
            }}
          >
            {/* Avatar */}
            <Avatar
              alt={sender}
              src="/google.svg"
              sx={{
                bgcolor: theme.palette.mode === 'light' ? '#e0e7ff' : '#ffffff', // Light blue for visibility in light mode
                color: theme.palette.mode === 'light' ? '#1a202c' : '#000000', // Dark text for light mode
                width: 32,
                height: 32,
                fontSize: '1rem', // Adjust font size for icons
              }}
            >
              {sender === 'bot' ? 'B' : 'U'}
            </Avatar>

            {/* Text Content */}
            <Box flexGrow={1}>
              <Typography variant="subtitle2" color="text.primary">
                {sender === 'bot' ? 'Gemini 1.5 Flash' : 'User'}
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                mt={1}
                sx={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {text}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
