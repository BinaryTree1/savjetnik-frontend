// src/components/Chat/ChatMessage.jsx
import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Snackbar } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import ChatAvatar from './ChatAvatar.jsx';
import ChatText from './ChatText.jsx';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

/**
 * ChatMessage Component
 *
 * Renders a chat message with avatar, text, and action buttons for bot messages.
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

    // State for Snackbar (feedback messages)
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // State to track if the user liked or disliked the message
    const [reaction, setReaction] = useState(null); // 'like' | 'dislike' | null

    // Handlers for like and dislike actions
    const handleLike = () => {
        if (reaction === 'like') {
            setReaction(null); // Toggle off if already liked
        } else {
            setReaction('like'); // Set to like
        }
    };

    const handleDislike = () => {
        if (reaction === 'dislike') {
            setReaction(null); // Toggle off if already disliked
        } else {
            setReaction('dislike'); // Set to dislike
        }
    };

    // Handler for copying text to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(
            () => {
                setOpenSnackbar(true); // Show success message
            },
            (err) => {
                console.error('Failed to copy message:', err);
            }
        );
    };

    // Handler to close the Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Box width="100%">
            {/* Message Bubble */}
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
                        flexDirection="row"
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

            {/* Action Buttons for Bot Messages */}
            {sender === 'bot' && (
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    px={2}
                    pb={2}
                    gap={1}
                    sx={{
                        width: {
                            xs: '100%',
                            sm: '90%',
                            md: '80%',
                            lg: '80%',
                            xl: '70%',
                        },
                        margin: '0 auto', // Center the action buttons row
                    }}
                >
                    {/* Like Button */}
                    <Tooltip title={reaction === 'like' ? 'Unlike' : 'Like'}>
                        <IconButton
                            aria-label={reaction === 'like' ? 'unlike' : 'like'}
                            onClick={handleLike}
                            size="small"
                            color={reaction === 'like' ? 'primary' : 'default'}
                        >
                            <ThumbUpAltOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Dislike Button */}
                    <Tooltip title={reaction === 'dislike' ? 'Remove Dislike' : 'Dislike'}>
                        <IconButton
                            aria-label={reaction === 'dislike' ? 'remove dislike' : 'dislike'}
                            onClick={handleDislike}
                            size="small"
                            color={reaction === 'dislike' ? 'error' : 'default'}
                        >
                            <ThumbDownAltOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Copy Button */}
                    <Tooltip title="Copy Message">
                        <IconButton
                            aria-label="copy"
                            onClick={handleCopy}
                            size="small"
                            color="inherit" // Follows theme colors
                        >
                            <ContentCopyOutlinedIcon fontSize="small" color="action"/>
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Snackbar for Copy Action */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message="Message copied to clipboard"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
        </Box>
    );
};

ChatMessage.propTypes = {
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'bot']).isRequired,
};

export default React.memo(ChatMessage);
