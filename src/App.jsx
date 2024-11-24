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

    const addChatToFolder = useStore((state) => state.addChatToFolder);
    const removeChatFromFolders = useStore(
        (state) => state.removeChatFromFolders
    );
    const initializeUnfolderedChats = useStore(
        (state) => state.initializeUnfolderedChats
    );
    const removeChatFromFolder = useStore(
        (state) => state.removeChatFromFolder
    );

    const toggleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const isSidebarOpen = useStore((state) => state.isSidebarOpen);
    const toggleSidebar = useStore((state) => state.toggleSidebar);

    const isFolderView = useStore((state) => state.isFolderView);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Parse the draggableId to get the context and chatId
        const [sourceContext, , chatIdStr] = draggableId.split('-');
        const chatId = parseInt(chatIdStr, 10);

        // Handle dragging from folder to sidebar (remove from folder)
        if (
            source.droppableId.startsWith('folder-') &&
            destination.droppableId === 'sidebar-chats'
        ) {
            removeChatFromFolders(chatId);
        }
        // Handle dragging from sidebar to folder (add to folder)
        else if (
            source.droppableId === 'sidebar-chats' &&
            destination.droppableId.startsWith('folder-')
        ) {
            const folderId = parseInt(
                destination.droppableId.replace('folder-', ''),
                10
            );
            addChatToFolder(chatId, folderId);
        }
        // Handle moving between folders
        else if (
            source.droppableId.startsWith('folder-') &&
            destination.droppableId.startsWith('folder-')
        ) {
            const sourceFolderId = parseInt(
                source.droppableId.replace('folder-', ''),
                10
            );
            const destinationFolderId = parseInt(
                destination.droppableId.replace('folder-', ''),
                10
            );

            if (sourceFolderId !== destinationFolderId) {
                removeChatFromFolder(chatId, sourceFolderId);
                addChatToFolder(chatId, destinationFolderId);
            }
        }

        // Re-initialize unfolderedChats to update the sidebar list
        initializeUnfolderedChats();
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
