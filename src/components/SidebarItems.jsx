// src/components/SidebarItems.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useDebounce from '../hooks/useDebounce.jsx';
import useStore from '../store';
import SidebarItem from './SidebarItem.jsx';

const SidebarItems = () => {
  // Accessing the theme from MUI
  const muiTheme = useStore((state) => state.muiTheme); // Ensure you have this in your store if used

  // Accessing state from Zustand without transforming it
  const chats = useStore((state) => state.chats); // Raw chats array
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
                <Box px={2} py={1}>
                  <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Search chats"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      fullWidth
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                        ),
                        sx: {
                          '& fieldset': {
                            border: 'none',
                          },
                        },
                      }}
                      sx={{
                        borderRadius: '8px',
                      }}
                      aria-label="Search Chats"
                  />
                </Box>

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
        <Dialog
            open={isRenameDialogOpen}
            onClose={handleCloseRenameDialog}
            fullScreen={false}
            aria-labelledby="rename-chat-dialog"
            maxWidth="xs"
            fullWidth
        >
          <DialogTitle id="rename-chat-dialog">Rename Chat</DialogTitle>
          <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label="Chat Name"
                fullWidth
                variant="outlined"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                inputProps={{
                  maxLength: 50,
                }}
                helperText={`${newChatTitle.length}/50`}
                aria-label="Chat Name"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRenameDialog}>Cancel</Button>
            <Button
                onClick={handleConfirmRename}
                variant="contained"
                color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
            open={isDeleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            fullScreen={false}
            aria-labelledby="delete-chat-dialog"
            maxWidth="xs"
            fullWidth
        >
          <DialogTitle id="delete-chat-dialog">Delete Chat</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete the chat "
              <strong>{chatToDelete?.title}</strong>"? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </DragDropContext>
  );
};

export default SidebarItems;
