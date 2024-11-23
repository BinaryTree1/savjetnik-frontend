// src/components/Chat/ChatInput.jsx
import React, { useRef } from 'react';
import { TextField, IconButton, Paper } from '@mui/material';
import { AttachFile, InsertEmoticon, Send } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

/**
 * ChatInput Component
 *
 * Provides an input field for the user to type and send messages.
 *
 * @param {Object} props - Component props.
 * @param {string} props.message - The current message text.
 * @param {Function} props.setMessage - Function to update the message text.
 * @param {Function} props.onSend - Function to send the message.
 */
const ChatInput = ({ message, setMessage, onSend }) => {
    const theme = useTheme();
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={(e) => {
                e.preventDefault();
                onSend();
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
                aria-label="Message Input"
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
                onClick={onSend}
                aria-label="Send Message"
                sx={{
                    color: 'text.secondary',
                    '&:hover': {
                        bgcolor: theme.palette.hover,
                    },
                    mt: 0.5,
                }}
                disabled={message.trim() === ''}
            >
                <Send />
            </IconButton>
        </Paper>
    );
};

ChatInput.propTypes = {
    message: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
};

export default React.memo(ChatInput);
