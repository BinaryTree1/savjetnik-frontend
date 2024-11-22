// src/components/Sidebar/SidebarHeader.jsx
import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  WbSunny as WbSunnyIcon,
  NightlightRound as NightlightRoundIcon,
} from '@mui/icons-material';
import useStore from '../../store';

const SidebarHeader = ({ themeMode, setThemeMode }) => {
  const theme = useTheme();
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      {isSidebarOpen && (
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
              theme.palette.mode === 'light'
                ? theme.palette.text.secondary
                : theme.palette.common.white,
          }}
          aria-label="Toggle Theme"
        >
          {themeMode === 'light' ? <NightlightRoundIcon /> : <WbSunnyIcon />}
        </IconButton>
        {/* Toggle Sidebar Button */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: theme.palette.text.primary,
          }}
          aria-label={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default SidebarHeader;
