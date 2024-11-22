// components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
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
import { useTheme } from '@mui/material/styles';
import ChatMessage from './ChatMessage.jsx';
import useStore from '../store';

const ChatWindow = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const theme = useTheme();

  const selectedChatId = useStore((state) => state.selectedChatId);
  const chats = useStore((state) => state.chats);
  const sendMessage = useStore((state) => state.sendMessage);

  const messages =
    chats.find((chat) => chat.id === selectedChatId)?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderInput = () => (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: '8px 16px',
        bgcolor: 'background.paper',
        width: '100%',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <IconButton
        aria-label="Attach File"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: theme.palette.hover,
          },
          mt: 0.5,
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
        variant="standard"
        multiline
        maxRows={4}
        sx={{
          flex: 1,
          mx: 2,
          '& .MuiInputBase-root': {
            '&:before, &:after': {
              borderBottom: 'none',
            },
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
          mt: 0.5,
        }}
      >
        <InsertEmoticon />
      </IconButton>

      <IconButton
        onClick={handleSendMessage}
        aria-label="Send Message"
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: theme.palette.hover,
          },
          mt: 0.5,
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
            <ChatMessage key={index} text={msg.text} sender={msg.sender} />
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
              Welcome to Chat
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

export default ChatWindow;
