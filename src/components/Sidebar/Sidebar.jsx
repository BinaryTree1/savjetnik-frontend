// src/components/Sidebar/Sidebar.jsx
import React, { useContext } from 'react';
import {
    Divider,
    Paper,
} from '@mui/material';
import SidebarHeader from './SidebarHeader.jsx';
import ViewToggleButton from './ViewToggleButton.jsx';
import NewChatButton from './NewChatButton.jsx';
import SidebarItems from './SidebarItems.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';
import useStore from '../../store';

const Sidebar = () => {
    const isSidebarOpen = useStore((state) => state.isSidebarOpen);

    const { themeMode, setThemeMode } = useContext(ThemeContext);

    return (
        <Paper
            elevation={0}
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
                height: '100vh',
                borderRight: 1,
                borderColor: 'divider',
                bgcolor: 'background.sidebar',
            }}
        >
            {/* Header */}
            <SidebarHeader themeMode={themeMode} setThemeMode={setThemeMode} />

            {/* Sidebar Content */}
            {isSidebarOpen && (
                <>
                    {/* View Toggle Button */}
                    <ViewToggleButton />

                    {/* Conditionally Render the "New Chat" Button */}
                    <NewChatButton />

                    <Divider />

                    {/* Sidebar Items */}
                    <SidebarItems />
                </>
            )}
        </Paper>
    );
};

export default Sidebar;
