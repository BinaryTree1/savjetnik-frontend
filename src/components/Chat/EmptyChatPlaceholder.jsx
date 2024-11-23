// src/components/Chat/EmptyChatPlaceholder.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { MenuBook } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

/**
 * EmptyChatPlaceholder Component
 *
 * Displays a welcome message and an icon when there are no chat messages.
 */
const EmptyChatPlaceholder = () => {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={3}
        >
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
    );
};

export default React.memo(EmptyChatPlaceholder);
