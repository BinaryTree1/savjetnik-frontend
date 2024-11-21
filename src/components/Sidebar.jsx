// components/Sidebar.jsx
import React from 'react';
import {
    Box,
    IconButton,
    Button,
    Typography,
    Divider,
    useMediaQuery,
    useTheme as useMuiTheme,
} from '@mui/material';
import {
    Add as AddIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    WbSunny as WbSunnyIcon,
    NightlightRound as NightlightRoundIcon,
    Folder as FolderIcon,
    Chat as ChatIcon,
} from '@mui/icons-material';
import SidebarItems from './SidebarItems';
import useStore from '../store';

const Sidebar = () => {
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    const isSidebarOpen = useStore((state) => state.isSidebarOpen);
    const toggleSidebar = useStore((state) => state.toggleSidebar);

    const themeMode = useStore((state) => state.themeMode);
    const toggleTheme = useStore((state) => state.toggleThemeMode);

    const isFolderView = useStore((state) => state.isFolderView);
    const toggleView = useStore((state) => state.toggleFolderView);

    const addChat = useStore((state) => state.addChat);

    return (
        <Box
            sx={{
                transition: 'all 0.3s ease-in-out',
                flexShrink: 0,
                width: !isSidebarOpen
                    ? 0
                    : {
                        xs: '100%',
                        sm: '100%',
                        md: '30%',
                        lg: '20%',
                        xl: '18%',
                    },
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: 'background.sidebar',
            }}
        >
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                {!isSidebarOpen && (
                    <Typography variant="subtitle1" noWrap color="text.primary">
                        Home Workspace
                    </Typography>
                )}
                <Box display="flex" alignItems="center">
                    {/* Toggle Theme Button */}
                    <IconButton
                        onClick={toggleTheme}
                        sx={{
                            color:
                                muiTheme.palette.mode === 'light'
                                    ? muiTheme.palette.text.secondary
                                    : muiTheme.palette.common.white,
                        }}
                        aria-label="Toggle Theme"
                    >
                        {themeMode === 'light' ? <NightlightRoundIcon /> : <WbSunnyIcon />}
                    </IconButton>
                    {/* Toggle Sidebar Button */}
                    <IconButton
                        onClick={toggleSidebar}
                        sx={{
                            color: muiTheme.palette.text.primary,
                        }}
                        aria-label={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                    >
                        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Box>
            </Box>

            {/* Sidebar Content */}
            {isSidebarOpen && (
                <>
                    {/* Toggle View Button (Saved Chats / Messages) */}
                    <Box px={2} mb={2}>
                        <Button
                            onClick={toggleView}
                            variant="outlined"
                            fullWidth
                            startIcon={isFolderView ? <ChatIcon /> : <FolderIcon />}
                            sx={{
                                color: 'text.primary',
                                borderColor: muiTheme.palette.divider,
                                '&:hover': {
                                    bgcolor: muiTheme.palette.hover,
                                },
                                textTransform: 'none',
                                justifyContent: 'flex-center',
                            }}
                            aria-label={isFolderView ? 'Show Messages' : 'Show Saved Chats'}
                        >
                            {isFolderView ? 'Messages' : 'Saved Chats'}
                        </Button>
                    </Box>

                    {/* Conditionally Render the "New Chat" Button */}
                    {!isFolderView && (
                        <Box px={2} mb={2}>
                            <Button
                                onClick={addChat}
                                variant="outlined"
                                fullWidth
                                startIcon={<AddIcon />}
                                sx={{
                                    color: 'text.primary',
                                    borderColor: muiTheme.palette.divider,
                                    '&:hover': {
                                        bgcolor: muiTheme.palette.hover,
                                    },
                                    textTransform: 'none',
                                }}
                            >
                                New Chat
                            </Button>
                        </Box>
                    )}

                    <Divider />

                    {/* Sidebar Items */}
                    <SidebarItems />
                </>
            )}
        </Box>
    );
};

export default Sidebar;
