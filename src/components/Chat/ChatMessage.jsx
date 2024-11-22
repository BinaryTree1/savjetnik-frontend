// src/components/Chat/ChatMessage.jsx
import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import ChatAvatar from './ChatAvatar.jsx';
import ChatText from './ChatText.jsx';

/**
 * ChatMessage Component
 *
 * Renders a chat message with avatar and text.
 *
 * @param {Object} props - Component props.
 * @param {string} props.text - The message text.
 * @param {string} props.sender - The sender type ('user' or 'bot').
 */
const ChatMessage = ({ text, sender }) => {
  const theme = useTheme();

  const backgroundColor =
    sender === 'user'
      ? theme.palette.mode === 'light'
        ? '#f1f3f5'
        : theme.palette.background.paper
      : 'transparent';

  return (
    <Box width="100%">
      <Box
        display="flex"
        alignItems="flex-start"
        p={2}
        sx={{
          bgcolor: backgroundColor,
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
                xs: '100%',
                sm: '90%',
                md: '80%',
                lg: '80%',
                xl: '70%',
              },
            }}
          >
            {/* Avatar */}
            <ChatAvatar sender={sender} />

            {/* Text Content */}
            <ChatText sender={sender} text={text} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ChatMessage.propTypes = {
  text: PropTypes.string.isRequired,
  sender: PropTypes.oneOf(['user', 'bot']).isRequired,
};

export default React.memo(ChatMessage);
