import React, { useState, useMemo } from 'react';
import { Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useDebounce from '../../hooks/useDebounce.jsx';
import useStore from '../../store';
import SidebarItem from './SidebarItem.jsx';
import SidebarSearch from './SidebarSearch.jsx';
import RenameChatDialog from './RenameChatDialog.jsx';
import DeleteChatDialog from './DeleteChatDialog.jsx';

const SidebarItems = () => {
  const chats = useStore((state) => state.chats);
  const selectedChatId = useStore((state) => state.selectedChatId);
  const editChat = useStore((state) => state.editChat);
  const deleteChat = useStore((state) => state.deleteChat);
  const selectChat = useStore((state) => state.selectChat);
  const reorderChats = useStore((state) => state.reorderChats);

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
    // Filter chats that have at least one message
    const activeChats = chats.filter((chat) => chat.messages.length > 0);

    // Further filter based on the search query
    if (!debouncedSearchQuery.trim()) {
      return activeChats;
    }

    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    return activeChats.filter((chat) =>
      chat.title.toLowerCase().includes(lowercasedQuery)
    );
  }, [chats, debouncedSearchQuery]);

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
    if (newChatTitle.trim() !== '') {
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
    deleteChat(chatToDelete.id);
    handleCloseDeleteDialog();
  };

  // Handler for Drag and Drop
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedChats = Array.from(filteredChats);
    const [movedChat] = reorderedChats.splice(result.source.index, 1);
    reorderedChats.splice(result.destination.index, 0, movedChat);

    // Reorder chats in the store based on the new order
    reorderChats(reorderedChats);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sidebar-chats-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
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
                  ? 'No chats.'
                  : 'No chats match your search.'}
              </Typography>
            ) : (
              filteredChats.map((chat, index) => (
                <Draggable
                  key={chat.id.toString()}
                  draggableId={chat.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <SidebarItem
                        id={chat.id}
                        title={chat.title || 'Untitled Chat'}
                        selected={chat.id === selectedChatId}
                        onEdit={handleOpenRenameDialog}
                        onDelete={handleOpenDeleteDialog}
                        onClick={selectChat}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

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
    </DragDropContext>
  );
};

export default SidebarItems;
