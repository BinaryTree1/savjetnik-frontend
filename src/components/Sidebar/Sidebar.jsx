// src/components/Sidebar/Sidebar.jsx
import React, { useContext } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

import {
    MessageSquare as MessageIcon,
    Folder as FolderIcon,
    Sun as SunIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Moon as MoonIcon,
} from "lucide-react";
import { ThemeContext } from '../../context/ThemeContext.jsx';
import useStore from '../../store';
import SidebarItems from './SidebarItems.jsx';

const Sidebar = React.memo(() => {
    const { themeMode, setThemeMode } = useContext(ThemeContext);
    const isDarkMode = themeMode === 'dark';

    const toggleFolderView = useStore((state) => state.toggleFolderView);
    const isFolderView = useStore((state) => state.isFolderView);

    const toggleSidebar = useStore((state) => state.toggleSidebar);
    const isSidebarOpen = useStore((state) => state.isSidebarOpen);

    return (
        <Box
            sx={{
                width: isSidebarOpen ? {
                    xs: '100%',
                    sm: '100%',
                    md: '30%',
                    lg: '25%',
                    xl: '25%',
                } : '0px', // Collapsed width
                display: 'flex',
                flexDirection: 'row',
                borderRight: isSidebarOpen ? '1px solid' : 'none',
                borderColor: 'divider',
                backgroundColor: isSidebarOpen ? 'background.sidebar' : 'transparent',
                height: '100vh',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
            }}
        >
            {/* Left Section: Icon Buttons */}
            <Box
                sx={{
                    width: '64px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 2,
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                }}
            >
                {/* Toggle Button */}
                <Tooltip title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"} placement="right">
                    <IconButton
                        onClick={toggleSidebar}
                        sx={{
                            width: '40px',
                            height: '40px',
                            mb: 2,
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                            },
                        }}
                        aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isSidebarOpen ? (
                            <ChevronLeftIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
                        ) : (
                            <ChevronRightIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
                        )}
                    </IconButton>
                </Tooltip>

                {/* Chat View Button */}
                {isSidebarOpen && (
                    <Tooltip title="Chat View" placement="right">
                        <IconButton
                            onClick={() => {
                                if (isFolderView) toggleFolderView();
                            }}
                            sx={{
                                width: '40px',
                                height: '40px',
                                mb: 1,
                                '&:hover': {
                                    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                                },
                            }}
                            aria-label="Chat View"
                        >
                            <MessageIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Saved Chats (Folder) View Button */}
                {isSidebarOpen && (
                    <Tooltip title="Saved Chats" placement="right">
                        <IconButton
                            onClick={() => {
                                if (!isFolderView) toggleFolderView();
                            }}
                            sx={{
                                width: '40px',
                                height: '40px',
                                mb: 1,
                                '&:hover': {
                                    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                                },
                            }}
                            aria-label="Saved Chats (Folder View)"
                        >
                            <FolderIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Toggle Dark Mode Button */}
                {isSidebarOpen && (
                    <Tooltip title="Toggle Dark Mode" placement="right">
                        <IconButton
                            onClick={() => setThemeMode(isDarkMode ? 'light' : 'dark')}
                            sx={{
                                width: '40px',
                                height: '40px',
                                '&:hover': {
                                    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                                },
                            }}
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <SunIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
                            ) : (
                                <MoonIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
                            )}
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Right Section: Search Bar and Chat List */}
            {isSidebarOpen && (
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        backgroundColor: 'background.sidebar',
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    {/* Sidebar Items */}
                    <SidebarItems />
                </Box>
            )}
        </Box>
    );
});

export default Sidebar;
