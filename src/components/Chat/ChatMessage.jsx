// src/components/Chat/ChatMessage.jsx
import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Tooltip,
    Snackbar,
    TextField,
    Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import ChatAvatar from './ChatAvatar.jsx';
import ChatText from './ChatText.jsx';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import useStore from '../../store/MainStore.jsx'; // Import your Zustand store

/**
 * ChatMessage Component
 *
 * Renders a chat message with avatar, text, and action buttons.
 *
 * @param {Object} props - Component props.
 * @param {string} props.text - The message text.
 * @param {string} props.sender - The sender type ('user' or 'bot').
 * @param {number} props.index - The index of the message in the messages array.
 */
const ChatMessage = ({ text, sender, index }) => {
    const theme = useTheme();
    const editMessage = useStore((state) => state.editMessage);
    const deleteMessagesAfter = useStore((state) => state.deleteMessagesAfter);

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

    // State for editing
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);

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

    // Handler for editing
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (editedText.trim() === '') {
            alert('Message cannot be empty.');
            return;
        }
        editMessage(index, editedText);
        // Delete messages after the edited message
        deleteMessagesAfter(index + 1);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedText(text);
        setIsEditing(false);
    };

    return (
        <Box width="100%">
            {/* Message Bubble */}
            <Box
                display="flex"
                alignItems="flex-start"
                p={2}
                pb={1}
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
                        {isEditing ? (
                            <TextField
                                fullWidth
                                multiline
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                            />
                        ) : (
                            <ChatText sender={sender} text={text} />
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={0}
                pb={1}
                gap={1}
                sx={{
                    bgcolor:
                        sender === 'user' ? backgroundColor : 'transparent',
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{
                        width: {
                            xs: '100%',
                            sm: '90%',
                            md: '80%',
                            lg: '80%',
                            xl: '70%',
                        },
                    }}
                    gap={1}
                >
                    {sender === 'user' ? (
                        <>
                            {/* Edit Button */}
                            {!isEditing && (
                                <Tooltip title="Edit Message">
                                    <IconButton
                                        aria-label="edit"
                                        onClick={handleEdit}
                                        size="small"
                                    >
                                        <EditOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {/* Save and Cancel Buttons for Editing */}
                            {isEditing && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={handleSaveEdit}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Like Button */}
                            <Tooltip
                                title={reaction === 'like' ? 'Unlike' : 'Like'}
                            >
                                <IconButton
                                    aria-label={
                                        reaction === 'like' ? 'unlike' : 'like'
                                    }
                                    onClick={handleLike}
                                    size="small"
                                    color={
                                        reaction === 'like'
                                            ? 'primary'
                                            : 'default'
                                    }
                                >
                                    <ThumbUpAltOutlinedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            {/* Dislike Button */}
                            <Tooltip
                                title={
                                    reaction === 'dislike'
                                        ? 'Remove Dislike'
                                        : 'Dislike'
                                }
                            >
                                <IconButton
                                    aria-label={
                                        reaction === 'dislike'
                                            ? 'remove dislike'
                                            : 'dislike'
                                    }
                                    onClick={handleDislike}
                                    size="small"
                                    color={
                                        reaction === 'dislike'
                                            ? 'error'
                                            : 'default'
                                    }
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
                                    color="inherit"
                                >
                                    <ContentCopyOutlinedIcon
                                        fontSize="small"
                                        color="action"
                                    />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            </Box>

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
    index: PropTypes.number.isRequired,
};

export default React.memo(ChatMessage);
