// App.js
import React from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import FolderDisplay from './components/FolderDisplay.jsx';
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  WbSunny as WbSunnyIcon,
  NightlightRound as NightlightRoundIcon,
} from '@mui/icons-material';
import useStore from './store';

const App = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  const themeMode = useStore((state) => state.themeMode);
  const toggleTheme = useStore((state) => state.toggleThemeMode);

  const isFolderView = useStore((state) => state.isFolderView);

  return (
      <Box display="flex" height="100vh" width="100vw">
        {isMobile ? (
            <Drawer
                variant="temporary"
                open={isSidebarOpen}
                onClose={toggleSidebar}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  '& .MuiDrawer-paper': {
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    boxSizing: 'border-box',
                  },
                }}
                PaperProps={{
                  sx: {
                    width: '100%',
                    height: '100%',
                  },
                }}
            >
              <Sidebar />
            </Drawer>
        ) : (
            <Sidebar />
        )}

        <Box
            component="main"
            flexGrow={1}
            position="relative"
            width={isMobile && isSidebarOpen ? 0 : '100%'}
            sx={{
              transition: 'width 0.3s ease-in-out',
              overflow: 'hidden',
            }}
        >
          {!isSidebarOpen && (
              <>
                <IconButton
                    onClick={toggleSidebar}
                    sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
                    aria-label="Open Sidebar"
                >
                  <ChevronRightIcon />
                </IconButton>
                <IconButton
                    onClick={toggleTheme}
                    sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
                    aria-label="Toggle Theme"
                >
                  {themeMode === 'light' ? <NightlightRoundIcon /> : <WbSunnyIcon />}
                </IconButton>
              </>
          )}
          {isFolderView ? <FolderDisplay /> : <ChatWindow />}
        </Box>
      </Box>
  );
};

export default App;
