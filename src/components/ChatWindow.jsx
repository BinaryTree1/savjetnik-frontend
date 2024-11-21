// ChatWindow.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
} from '@mui/material';
import {
  AttachFile,
  InsertEmoticon,
  Send,
  MenuBook,
} from '@mui/icons-material';
import { ThemeContext } from '@/context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import Message from './Message.jsx';
import PropTypes from 'prop-types';

const ChatWindow = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { themeMode } = useContext(ThemeContext);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderInput = () => (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
      sx={{
        display: 'flex',
        alignItems: 'flex-start', // Align with multiline input
        p: '8px 16px',
        bgcolor: 'background.paper',
        width: '100%',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`, // Border around the Paper
      }}
    >
      <IconButton
        aria-label="Attach File"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: theme.palette.hover,
          },
          mt: 0.5, // Slight top margin for alignment
        }}
      >
        <AttachFile />
      </IconButton>

      <TextField
        inputRef={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything."
        onKeyDown={handleKeyDown}
        variant="standard" // Remove border
        multiline // Enable multiline
        maxRows={4} // Optional: limit to 4 rows
        sx={{
          flex: 1,
          mx: 2,
          '& .MuiInputBase-root': {
            // Remove the underline
            '&:before, &:after': {
              borderBottom: 'none',
            },
            // Remove the focused underline
            '&.Mui-focused:before': {
              borderBottom: 'none',
            },
          },
        }}
        InputProps={{ disableUnderline: true }}
      />

      <IconButton
        aria-label="Emoji"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: theme.palette.hover,
          },
          mt: 0.5, // Slight top margin for alignment
        }}
      >
        <InsertEmoticon />
      </IconButton>

      <IconButton
        onClick={sendMessage}
        aria-label="Send Message"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: theme.palette.hover,
          },
          mt: 0.5, // Slight top margin for alignment
        }}
      >
        <Send />
      </IconButton>
    </Paper>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      bgcolor="background.default"
    >
      {/* Messages Area */}
      <Box flexGrow={1} overflow="auto" p={2}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <Message key={index} text={msg.text} sender={msg.sender} />
          ))
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={3}
          >
            {/* Enlarged Book Icon */}
            <MenuBook
              sx={{
                fontSize: '5rem',
                color: theme.palette.action.active,
              }}
            />
            <Typography
              variant="h4"
              color="textSecondary"
              align="center"
              mt={2}
            >
              Savjetnik.ai
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        position="sticky"
        bottom={0}
        p={2}
        borderTop={1}
        borderColor="divider"
        bgcolor="background.default"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: {
              xs: '100%',
              sm: '90%',
              md: '80%',
              lg: '80%',
              xl: '70%',
            },
            mx: {
              xs: 0,
              sm: 'auto',
              md: 'auto',
            },
            p: {
              xs: 0,
              sm: 1,
              md: 2,
            },
          }}
        >
          {renderInput()}
        </Box>
      </Box>
    </Box>
  );
};

ChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      sender: PropTypes.oneOf(['user', 'bot']).isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
};

export default ChatWindow;
