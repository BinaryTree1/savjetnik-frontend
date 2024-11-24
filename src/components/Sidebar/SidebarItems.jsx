// src/components/Sidebar/SidebarItems.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import useDebounce from '../../hooks/useDebounce.jsx';
import useStore from '../../store';
import SidebarItem from './SidebarItem.jsx';
import SidebarSearch from './SidebarSearch.jsx';
import RenameChatDialog from './RenameChatDialog.jsx';
import DeleteChatDialog from './DeleteChatDialog.jsx';

/**
 * SidebarItems Component
 *
 * Displays a searchable list of chat items with options to rename or delete each chat.
 */
const SidebarItems = () => {
    const chats = useStore((state) => state.chats);
    const unfolderedChats = useStore((state) => state.unfolderedChats);
    const folders = useStore((state) => state.folders);
    const selectedChatId = useStore((state) => state.selectedChatId);
    const editChat = useStore((state) => state.editChat);
    const deleteChat = useStore((state) => state.deleteChat);
    const selectChat = useStore((state) => state.selectChat);
    const initializeUnfolderedChats = useStore(
        (state) => state.initializeUnfolderedChats
    );

    // Initialize unfoldered chats on component mount
    useEffect(() => {
        initializeUnfolderedChats();
    }, [initializeUnfolderedChats]);

    // Local component states
    const [searchQuery, setSearchQuery] = useState('');

    // Dialog states
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);
    const [newChatTitle, setNewChatTitle] = useState('');

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);

    // Handler for search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Debounce the search query to optimize performance
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    /**
     * Memoize the filtered chats to prevent unnecessary computations
     * and ensure stable references unless dependencies change.
     */
    const filteredChats = useMemo(() => {
        // Get all chats (since chats remain in the sidebar regardless of folder status)
        const chatsList = chats;

        // Filter chats that have at least one message
        const activeChats = chatsList.filter(
            (chat) => chat.messages.length > 0
        );

        // Further filter based on the search query
        if (!debouncedSearchQuery.trim()) {
            return activeChats;
        }

        const lowercasedQuery = debouncedSearchQuery.toLowerCase();
        return activeChats.filter((chat) =>
            chat.title.toLowerCase().includes(lowercasedQuery)
        );
    }, [chats, debouncedSearchQuery]);

    // Function to check if a chat is in any folder
    const isChatInFolder = (chatId) => {
        return folders.some((folder) => folder.chatIds.includes(chatId));
    };

    // Handlers for Rename Dialog
    const handleOpenRenameDialog = (chatId) => {
        const chat = chats.find((c) => c.id === chatId);
        if (chat) {
            setChatToEdit(chat);
            setNewChatTitle(chat.title);
            setIsRenameDialogOpen(true);
        }
    };

    const handleCloseRenameDialog = () => {
        setIsRenameDialogOpen(false);
        setChatToEdit(null);
        setNewChatTitle('');
    };

    const handleConfirmRename = () => {
        if (newChatTitle.trim() !== '' && chatToEdit) {
            editChat(chatToEdit.id, newChatTitle.trim());
            handleCloseRenameDialog();
        }
    };

    // Handlers for Delete Dialog
    const handleOpenDeleteDialog = (chatId) => {
        const chat = chats.find((c) => c.id === chatId);
        if (chat) {
            setChatToDelete(chat);
            setIsDeleteDialogOpen(true);
        }
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setChatToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (chatToDelete) {
            deleteChat(chatToDelete.id);
            handleCloseDeleteDialog();
        }
    };

    return (
        <Droppable droppableId="sidebar-chats" type="CHAT">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                        backgroundColor: snapshot.isDraggingOver
                            ? 'lightblue'
                            : 'inherit',
                        width: 300, // Adjust the width as needed
                        overflowY: 'auto',
                        borderRight: '1px solid #e0e0e0',
                        padding: 16,
                    }}
                >
                    {/* Search Bar */}
                    <SidebarSearch
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                    />

                    {/* Display "No chats" message if there are no chats after filtering */}
                    {filteredChats.length === 0 ? (
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                            p={2}
                        >
                            {searchQuery.trim() === ''
                                ? 'No chats available.'
                                : 'No chats match your search.'}
                        </Typography>
                    ) : (
                        filteredChats.map((chat, index) => (
                            <Draggable
                                key={`sidebar-chat-${chat.id.toString()}`}
                                draggableId={`sidebar-chat-${chat.id}`}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging
                                                ? 0.5
                                                : 1,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <SidebarItem
                                            id={chat.id}
                                            title={
                                                chat.title || 'Untitled Chat'
                                            }
                                            selected={
                                                chat.id === selectedChatId
                                            }
                                            onEdit={handleOpenRenameDialog}
                                            onDelete={handleOpenDeleteDialog}
                                            onClick={selectChat}
                                            isInFolder={isChatInFolder(chat.id)}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))
                    )}
                    {provided.placeholder}

                    {/* Rename Dialog */}
                    <RenameChatDialog
                        open={isRenameDialogOpen}
                        onClose={handleCloseRenameDialog}
                        chatTitle={newChatTitle}
                        setChatTitle={setNewChatTitle}
                        onConfirm={handleConfirmRename}
                    />

                    {/* Delete Dialog */}
                    <DeleteChatDialog
                        open={isDeleteDialogOpen}
                        onClose={handleCloseDeleteDialog}
                        chatTitle={chatToDelete?.title}
                        onConfirm={handleConfirmDelete}
                    />
                </div>
            )}
        </Droppable>
    );
};

export default React.memo(SidebarItems);
