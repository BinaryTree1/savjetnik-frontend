// components/SidebarItems.jsx
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
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import SidebarItem from './SidebarItem';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from "../hooks/useDebounce.jsx";

const SidebarItems = ({
                        chats,
                        selectedChatId,
                        onEditChat,
                        onDeleteChat,
                        onSelectChat,
                        onReorderChats,
                      }) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Search state
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

  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay

  // Filtered chats based on search query
  const filteredChats = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return chats;
    }
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    return chats.filter((chat) =>
        chat.title.toLowerCase().includes(lowercasedQuery)
    );
  }, [chats, debouncedSearchQuery]);

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
      onEditChat(chatToEdit.id, newChatTitle.trim());
      handleCloseRenameDialog();
    }
  };

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
    onDeleteChat(chatToDelete.id);
    handleCloseDeleteDialog();
  };

  const handleDragEnd = (result) => {
    console.log('Drag end result:', result);

    if (!result.destination) {
      console.log('No destination');
      return;
    }

    const reorderedChats = Array.from(chats);
    const [movedChat] = reorderedChats.splice(result.source.index, 1);
    reorderedChats.splice(result.destination.index, 0, movedChat);

    console.log('Reordered chats:', reorderedChats);
    onReorderChats(reorderedChats);
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
                            border: 'none', // Removes the border
                          },
                        },
                      }}
                      sx={{
                        borderRadius: '8px', // Optional: Add rounded corners
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
                          {(provided, snapshot) => (
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
                                    onClick={onSelectChat}
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

SidebarItems.propTypes = {
  chats: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        messages: PropTypes.array.isRequired,
      })
  ).isRequired,
  selectedChatId: PropTypes.number,
  onEditChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired,
  onSelectChat: PropTypes.func.isRequired,
  onReorderChats: PropTypes.func.isRequired,
};

export default SidebarItems;
