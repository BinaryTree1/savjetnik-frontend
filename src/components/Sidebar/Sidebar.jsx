import React, { useContext } from 'react';
import { Divider, Paper, Box } from '@mui/material';
import SidebarHeader from './SidebarHeader.jsx';
import ViewToggleButton from './ViewToggleButton.jsx';
import NewChatButton from './NewChatButton.jsx';
import SidebarItems from './SidebarItems.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import useStore from '../../store';

/**
 * Sidebar Component
 *
 * Renders a collapsible sidebar with a header, toggle button,
 * "New Chat" button, and a list of sidebar items.
 *
 * @returns {JSX.Element} Sidebar component.
 */
const Sidebar = React.memo(() => {
    const isSidebarOpen = useStore((state) => state.isSidebarOpen);

    const { themeMode, setThemeMode } = useContext(ThemeContext);

    // Sidebar width configurations
    const sidebarWidth = {
        xs: '100%',
        sm: '100%',
        md: '30%',
        lg: '20%',
        xl: '18%',
    };

    return (
        <Paper
            elevation={0}
            sx={{
                transition: 'all 0.3s ease-in-out',
                flexShrink: 0,
                width: isSidebarOpen ? sidebarWidth : 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: 'background.sidebar',
            }}
        >
            {/* Header Section */}
            <SidebarHeader themeMode={themeMode} setThemeMode={setThemeMode} />

            {/* Content Section */}
            {isSidebarOpen && (
                <Box flexGrow={1} display="flex" flexDirection="column" sx={{ mt: 2 }}>
                    {/* View Toggle Button */}
                    <ViewToggleButton />

                    {/* "New Chat" Button */}
                    <NewChatButton />

                    <Divider sx={{ my: 0 }} />

                    {/* List of Sidebar Items */}
                    <SidebarItems />
                </Box>
            )}
        </Paper>
    );
});

export default Sidebar;
