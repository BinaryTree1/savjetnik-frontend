// src/components/Chat/ChatAvatar.jsx
import React from 'react';
import { Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

/**
 * ChatAvatar Component
 *
 * Displays an avatar for the sender (User or Bot) with appropriate styling.
 *
 * @param {Object} props - Component props.
 * @param {string} props.sender - The sender type ('user' or 'bot').
 */
const ChatAvatar = ({ sender }) => {
  const theme = useTheme();

  const getAvatarProps = () => {
    if (sender === 'bot') {
      return {
        bgcolor: theme.palette.primary.main,
        children: 'B',
        alt: 'Bot',
      };
    }
    return {
      bgcolor: theme.palette.secondary.main,
      children: 'U',
      alt: 'User',
    };
  };

  return (
    <Avatar
      {...getAvatarProps()}
      sx={{
        width: 32,
        height: 32,
        fontSize: '1rem',
        color: theme.palette.common.white,
      }}
    />
  );
};

ChatAvatar.propTypes = {
  sender: PropTypes.oneOf(['user', 'bot']).isRequired,
};

export default React.memo(ChatAvatar);
