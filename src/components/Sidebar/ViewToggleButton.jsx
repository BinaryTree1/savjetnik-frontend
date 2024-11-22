// src/components/Sidebar/ViewToggleButton.jsx
import React from 'react';
import { Box, Button } from '@mui/material';
import { Folder as FolderIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useStore from '../../store';

/**
 * ViewToggleButton Component
 * Toggles between Folder View and Chat View, displaying the corresponding icon and label.
 */
const ViewToggleButton = () => {
    const theme = useTheme();

    // Select isFolderView, which causes re-renders when it changes
    const isFolderView = useStore((state) => state.isFolderView);

    // Get toggleView without causing re-renders (functions are stable references)
    const toggleView = useStore((state) => state.toggleFolderView, () => true);

    // Constants for labels and icons
    const LABELS = {
        messages: 'Messages',
        savedChats: 'Saved Chats',
    };

    const ICONS = {
        messages: <ChatIcon />,
        savedChats: <FolderIcon />,
    };

    const currentLabel = isFolderView ? LABELS.messages : LABELS.savedChats;
    const currentIcon = isFolderView ? ICONS.messages : ICONS.savedChats;

    return (
        <Box px={2} mb={2}>
            <Button
                onClick={toggleView}
                variant="outlined"
                fullWidth
                startIcon={currentIcon}
                sx={{
                    color: 'text.primary',
                    borderColor: theme.palette.divider,
                    '&:hover': {
                        bgcolor: theme.palette.action.hover,
                    },
                    textTransform: 'none',
                    justifyContent: 'center',
                }}
                aria-label={`Switch to ${currentLabel} View`}
            >
                {currentLabel}
            </Button>
        </Box>
    );
};

export default React.memo(ViewToggleButton);
