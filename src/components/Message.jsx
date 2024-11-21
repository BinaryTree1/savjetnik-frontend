// components/Message.jsx
import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

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
                                ? '#f1f3f5'
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
                                xs: '100%',
                                sm: '90%',
                                md: '80%',
                                lg: '80%',
                                xl: '70%',
                            },
                        }}
                    >
                        {/* Avatar */}
                        <Avatar
                            alt={sender}
                            sx={{
                                bgcolor:
                                    sender === 'bot'
                                        ? theme.palette.primary.main
                                        : theme.palette.secondary.main,
                                color: theme.palette.common.white,
                                width: 32,
                                height: 32,
                                fontSize: '1rem',
                            }}
                        >
                            {sender === 'bot' ? 'B' : 'U'}
                        </Avatar>

                        {/* Text Content */}
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
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

Message.propTypes = {
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(['user', 'bot']).isRequired,
};

export default Message;
