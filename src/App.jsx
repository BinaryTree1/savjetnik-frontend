// App.js
import React, { useContext } from 'react';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import ChatWindow from './components/Chat/ChatWindow.jsx';
import FolderDisplay from './components/Folder/FolderDisplay.jsx';
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
import { ThemeContext } from './context/ThemeContext.jsx';
import { DragDropContext } from '@hello-pangea/dnd';

const App = () => {
    const { themeMode, setThemeMode } = useContext(ThemeContext);
    const theme = useTheme();

    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const isSidebarOpen = useStore((state) => state.isSidebarOpen);
    const toggleSidebar = useStore((state) => state.toggleSidebar);

    const isFolderView = useStore((state) => state.isFolderView);
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        // If dropped outside a droppable area
        if (!destination) return;

        // If the source and destination are the same, do nothing
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Extract chat ID from draggableId
        const chatId = parseInt(draggableId.replace('chat-', ''), 10);

        // Get current state
        const state = useStore.getState();
        const { folders, unfolderedChats } = state;

        // Initialize new state arrays
        let newFolders = [...folders];
        let newUnfolderedChats = [...unfolderedChats];

        // Remove chat from source
        if (source.droppableId === 'sidebar-chats') {
            newUnfolderedChats = newUnfolderedChats.filter(
                (id) => id !== chatId
            );
        } else if (source.droppableId.startsWith('folder-')) {
            const sourceFolderId = parseInt(
                source.droppableId.replace('folder-', ''),
                10
            );
            newFolders = newFolders.map((folder) => {
                if (folder.id === sourceFolderId) {
                    return {
                        ...folder,
                        chatIds: folder.chatIds.filter((id) => id !== chatId),
                    };
                }
                return folder;
            });
        }

        // Add chat to destination
        if (destination.droppableId === 'sidebar-chats') {
            newUnfolderedChats.push(chatId);
        } else if (destination.droppableId.startsWith('folder-')) {
            const destFolderId = parseInt(
                destination.droppableId.replace('folder-', ''),
                10
            );
            newFolders = newFolders.map((folder) => {
                if (folder.id === destFolderId) {
                    return {
                        ...folder,
                        chatIds: [...folder.chatIds, chatId],
                    };
                }
                return folder;
            });
        }

        // Update state
        useStore.setState({
            folders: newFolders,
            unfolderedChats: newUnfolderedChats,
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    zIndex: 10,
                                }}
                                aria-label="Open Sidebar"
                            >
                                <ChevronRightIcon />
                            </IconButton>
                            <IconButton
                                onClick={toggleTheme}
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    zIndex: 10,
                                }}
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
                    {isFolderView ? <FolderDisplay /> : <ChatWindow />}
                </Box>
            </Box>
        </DragDropContext>
    );
};

export default App;
