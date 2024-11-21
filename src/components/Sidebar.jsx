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
import PropTypes from 'prop-types';

const Sidebar = ({
  isCollapsed,
  onToggleSidebar,
  onToggleTheme,
  theme,
  chats,
  selectedChatId,
  onAddChat,
  onEditChat,
  onDeleteChat,
  onSelectChat,
  onReorderChats,
  isFolderView,
  onToggleView,
}) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm')); // Up to 600px

  return (
    <Box
      sx={{
        transition: 'all 0.3s ease-in-out',
        flexShrink: 0,
        width: isCollapsed
          ? 0
          : {
              xs: '100%', // Full width on extra small screens
              sm: '100%', // Full width on small screens
              md: '30%', // 30% width on medium screens (e.g., tablets)
              lg: '20%', // 20% width on large screens (e.g., desktops)
              xl: '18%', // 18% width on extra-large screens
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        {!isCollapsed && (
          <Typography variant="subtitle1" noWrap color="text.primary">
            Home Workspace
          </Typography>
        )}
        <Box display="flex" alignItems="center">
          {/* Toggle Theme Button */}
          <IconButton
            onClick={onToggleTheme}
            sx={{
              color:
                muiTheme.palette.mode === 'light'
                  ? muiTheme.palette.text.secondary
                  : muiTheme.palette.common.white,
            }}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <NightlightRoundIcon /> : <WbSunnyIcon />}
          </IconButton>
          {/* Toggle Sidebar Button */}
          <IconButton
            onClick={onToggleSidebar}
            sx={{
              color: muiTheme.palette.text.primary,
            }}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Sidebar Content */}
      {!isCollapsed && (
        <>
          {/* Toggle View Button (Saved Chats / Messages) */}
          <Box px={2} mb={2}>
            <Button
              onClick={onToggleView}
              variant="outlined"
              fullWidth
              startIcon={isFolderView ? <ChatIcon /> : <FolderIcon />}
              sx={{
                color: 'text.primary',
                borderColor: muiTheme.palette.divider,
                '&:hover': {
                  bgcolor: muiTheme.palette.hover,
                },
                textTransform: 'none', // Keeps the text as "Saved Chats" or "Messages"
                justifyContent: 'flex-center', // Align icon and text to the start
              }}
              aria-label={isFolderView ? 'Show Messages' : 'Show Saved Chats'}
            >
              {isFolderView ? 'Messages' : 'Saved Chats'}
            </Button>
          </Box>

          {/* New Chat Button */}
          <Box px={2} mb={2}>
            <Button
              onClick={onAddChat}
              variant="outlined"
              fullWidth
              startIcon={<AddIcon />}
              sx={{
                color: 'text.primary',
                borderColor: muiTheme.palette.divider,
                '&:hover': {
                  bgcolor: muiTheme.palette.hover,
                },
                textTransform: 'none', // Removes text transformation
              }}
            >
              New Chat
            </Button>
          </Box>

          <Divider />

          {/* Always render SidebarItems regardless of isFolderView */}
          <SidebarItems
            chats={chats}
            selectedChatId={selectedChatId}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
            onSelectChat={onSelectChat}
            onReorderChats={onReorderChats}
          />
        </>
      )}
    </Box>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      messages: PropTypes.array.isRequired,
    })
  ).isRequired,
  selectedChatId: PropTypes.number,
  onAddChat: PropTypes.func.isRequired,
  onEditChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired,
  onSelectChat: PropTypes.func.isRequired,
  onReorderChats: PropTypes.func.isRequired,
  isFolderView: PropTypes.bool.isRequired, // New prop
  onToggleView: PropTypes.func.isRequired, // New prop
};

export default Sidebar;
