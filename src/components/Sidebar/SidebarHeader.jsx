// src/components/Sidebar/SidebarHeader.jsx
import React, { useCallback } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    WbSunny as WbSunnyIcon,
    NightlightRound as NightlightRoundIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import useStore from '../../store';

/**
 * SidebarHeader Component
 *
 * Renders the header of the sidebar with the workspace title,
 * theme toggle button, and sidebar toggle button.
 * Enhances performance and accessibility by utilizing memoization
 * and proper ARIA attributes.
 *
 * @param {Object} props - Component props.
 * @param {string} props.themeMode - Current theme mode ('light' or 'dark').
 * @param {Function} props.setThemeMode - Function to toggle the theme mode.
 * @param {string} [props.title] - Title to display in the sidebar header.
 * @param {React.ReactNode} [props.startIcon] - Optional icon to display alongside the title.
 */
const SidebarHeader = React.memo(
    ({
        themeMode,
        setThemeMode,
        title = 'Home Workspace',
        startIcon = null,
    }) => {
        const theme = useTheme();
        const toggleSidebar = useStore((state) => state.toggleSidebar);
        const isSidebarOpen = useStore((state) => state.isSidebarOpen);

        /**
         * Toggles the theme between light and dark modes.
         */
        const toggleTheme = useCallback(() => {
            setThemeMode((prevMode) =>
                prevMode === 'light' ? 'dark' : 'light'
            );
        }, [setThemeMode]);

        /**
         * Handles the sidebar toggle action.
         */
        const handleToggleSidebar = useCallback(() => {
            toggleSidebar();
        }, [toggleSidebar]);

        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={2}
                py={1}
                bgcolor="background.paper"
                borderBottom={`1px solid ${theme.palette.divider}`}
            >
                {/* Title Section */}
                {isSidebarOpen && (
                    <Box display="flex" alignItems="center">
                        {startIcon && <Box mr={1}>{startIcon}</Box>}
                        <Typography variant="h7" noWrap color="text.primary">
                            {title}
                        </Typography>
                    </Box>
                )}

                {/* Action Buttons */}
                <Box display="flex" alignItems="center">
                    {/* Toggle Theme Button */}
                    <IconButton
                        onClick={toggleTheme}
                        sx={{
                            color:
                                themeMode === 'light'
                                    ? theme.palette.text.secondary
                                    : theme.palette.common.white,
                            transition: 'color 0.3s',
                        }}
                        aria-label="Toggle Theme"
                    >
                        {themeMode === 'light' ? (
                            <NightlightRoundIcon />
                        ) : (
                            <WbSunnyIcon />
                        )}
                    </IconButton>

                    {/* Toggle Sidebar Button */}
                    <IconButton
                        onClick={handleToggleSidebar}
                        sx={{
                            color: theme.palette.text.primary,
                            transition: 'color 0.3s',
                        }}
                        aria-label={
                            isSidebarOpen
                                ? 'Collapse Sidebar'
                                : 'Expand Sidebar'
                        }
                    >
                        {isSidebarOpen ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </Box>
            </Box>
        );
    }
);

SidebarHeader.propTypes = {
    themeMode: PropTypes.oneOf(['light', 'dark']).isRequired,
    setThemeMode: PropTypes.func.isRequired,
    title: PropTypes.string,
    startIcon: PropTypes.node,
};

export default SidebarHeader;
