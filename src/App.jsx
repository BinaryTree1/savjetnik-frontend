// App.js
import React, { useState, useContext, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import FolderDisplay from './components/FolderDisplay.jsx'; // Import FolderDisplay
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
import { ThemeContext } from './context/ThemeContext';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFolderView, setIsFolderView] = useState(false); // New state
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs')); // Up to 600px

  // Initialize chats state in App.js with one empty chat
  const [chats, setChats] = useState([{ id: 1, title: '', messages: [] }]);

  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const toggleView = () => {
    setIsFolderView((prev) => !prev); // Toggle between views
  };

  // Function to extract first few words from a message
  const getFirstFewWords = (text, wordCount = 3) => {
    const words = text.trim().split(/\s+/);
    return words.slice(0, wordCount).join(' ') || 'Untitled Chat';
  };

  // Handler to add a new chat or reuse an existing empty chat
  const handleAddChat = () => {
    // Check for existing empty chats
    const emptyChatIndex = chats.findIndex(
      (chat) => chat.messages.length === 0
    );

    if (emptyChatIndex !== -1) {
      // If an empty chat exists, move it to the top
      const emptyChat = chats[emptyChatIndex];
      const updatedChats = [
        emptyChat,
        ...chats.slice(0, emptyChatIndex),
        ...chats.slice(emptyChatIndex + 1),
      ];
      setChats(updatedChats);
      setSelectedChatId(emptyChat.id);
    } else {
      // If no empty chat exists, create a new one at the top
      const newChatId =
        chats.length > 0 ? Math.max(...chats.map((chat) => chat.id)) + 1 : 1;
      const newChat = { id: newChatId, title: '', messages: [] };
      setChats([newChat, ...chats]);
      setSelectedChatId(newChatId); // Automatically select the new chat
    }
  };

  // Handler to edit a chat's title
  const handleEditChat = (chatId, newTitle) => {
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  // Handler to delete a chat
  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (selectedChatId === chatId) {
      // If the deleted chat was selected, select the next available chat
      setSelectedChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
    }
  };

  // Handler to select a chat
  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  // Handler to send message
  const handleSendMessage = (messageText) => {
    if (!selectedChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === selectedChatId) {
          const isFirstMessage = chat.messages.length === 0;
          const updatedMessages = [
            ...chat.messages,
            { text: messageText, sender: 'user' },
          ];
          const updatedTitle = isFirstMessage
            ? getFirstFewWords(messageText)
            : chat.title;
          return {
            ...chat,
            messages: updatedMessages,
            title: updatedTitle,
          };
        }
        return chat;
      })
    );

    // Simulate bot response
    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { text: 'This is a bot response.', sender: 'bot' },
                ],
              }
            : chat
        )
      );
    }, 1000);
  };

  // Filter chats to include only those with at least one message
  const filteredChats = chats.filter((chat) => chat.messages.length > 0);

  const handleReorderChats = (newChatsOrder) => {
    setChats(newChatsOrder);
  };

  const renderSidebar = () => (
    <Sidebar
      isCollapsed={!isSidebarOpen}
      onToggleSidebar={toggleSidebar}
      onToggleTheme={toggleTheme}
      theme={themeMode}
      chats={filteredChats}
      selectedChatId={selectedChatId}
      onAddChat={handleAddChat}
      onEditChat={handleEditChat}
      onDeleteChat={handleDeleteChat}
      onSelectChat={handleSelectChat}
      onReorderChats={handleReorderChats} // Pass the handler
      isFolderView={isFolderView} // Pass the new state
      onToggleView={toggleView} // Pass the toggle function
    />
  );

  return (
    <Box display="flex" height="100vh" width="100vw">
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isSidebarOpen}
          onClose={toggleSidebar}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%', // Full screen width
              height: '100%', // Full screen height
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
          {renderSidebar()}
        </Drawer>
      ) : (
        renderSidebar()
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
              {themeMode === 'light' ? (
                <NightlightRoundIcon />
              ) : (
                <WbSunnyIcon />
              )}
            </IconButton>
          </>
        )}
        {/* Conditionally render based on isFolderView */}
        {isFolderView ? (
          <FolderDisplay
            chats={chats}
            onEditChat={handleEditChat}
            onDeleteChat={handleDeleteChat}
            onSelectChat={handleSelectChat}
            onReorderChats={handleReorderChats}
          />
        ) : (
          <ChatWindow
            messages={
              chats.find((chat) => chat.id === selectedChatId)?.messages || []
            }
            onSendMessage={handleSendMessage}
          />
        )}
      </Box>
    </Box>
  );
};

export default App;
