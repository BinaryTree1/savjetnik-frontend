import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * ChatText Component
 *
 * Displays the sender's name and the message text.
 *
 * @param {Object} props - Component props.
 * @param {string} props.sender - The sender type ('user' or 'bot').
 * @param {string} props.text - The message text.
 */
const ChatText = ({ sender, text }) => {
  return (
    <Box flexGrow={1}>
      <Typography variant="subtitle2" color="text.primary">
        {sender === 'bot' ? 'Bot' : 'User'}
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
  );
};

ChatText.propTypes = {
  sender: PropTypes.oneOf(['user', 'bot']).isRequired,
  text: PropTypes.string.isRequired,
};

export default React.memo(ChatText);
