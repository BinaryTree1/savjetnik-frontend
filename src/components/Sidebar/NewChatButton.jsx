// src/components/Sidebar/NewChatButton.jsx
import React from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import useStore from '../../store';
import { useTheme } from '@mui/material/styles';

const NewChatButton = () => {
    const theme = useTheme();
    const isFolderView = useStore((state) => state.isFolderView);
    const addChat = useStore((state) => state.addChat);

    if (isFolderView) return null;

    return (
        <Box px={2} mb={2}>
            <Button
                onClick={addChat}
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
                sx={{
                    color: 'text.primary',
                    borderColor: theme.palette.divider,
                    '&:hover': {
                        bgcolor: theme.palette.hover,
                    },
                    textTransform: 'none',
                }}
            >
                New Chat
            </Button>
        </Box>
    );
};

export default NewChatButton;
