// src/components/Sidebar/ViewToggleButton.jsx
import React from 'react';
import { Box, Button } from '@mui/material';
import { Folder as FolderIcon, Chat as ChatIcon } from '@mui/icons-material';
import useStore from '../../store';
import { useTheme } from '@mui/material/styles';

const ViewToggleButton = () => {
    const theme = useTheme();
    const isFolderView = useStore((state) => state.isFolderView);
    const toggleView = useStore((state) => state.toggleFolderView);

    return (
        <Box px={2} mb={2}>
            <Button
                onClick={toggleView}
                variant="outlined"
                fullWidth
                startIcon={isFolderView ? <ChatIcon /> : <FolderIcon />}
                sx={{
                    color: 'text.primary',
                    borderColor: theme.palette.divider,
                    '&:hover': {
                        bgcolor: theme.palette.hover,
                    },
                    textTransform: 'none',
                    justifyContent: 'flex-start',
                }}
                aria-label={isFolderView ? 'Show Messages' : 'Show Saved Chats'}
            >
                {isFolderView ? 'Messages' : 'Saved Chats'}
            </Button>
        </Box>
    );
};

export default ViewToggleButton;
