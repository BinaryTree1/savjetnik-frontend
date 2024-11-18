// SidebarItems.jsx
import React, { useState } from 'react';
import {
    List,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    useMediaQuery,
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import SidebarItem from './SidebarItem';
import PropTypes from 'prop-types';

const SidebarItems = ({ chats, selectedChatId, onEditChat, onDeleteChat, onSelectChat }) => {
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm')); // Up to 600px

    // State for Rename Dialog
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);
    const [newChatTitle, setNewChatTitle] = useState('');

    // State for Delete Dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);

    // Handler to open Rename Dialog
    const handleOpenRenameDialog = (chatId) => {
        const chat = chats.find((c) => c.id === chatId);
        if (chat) {
            setChatToEdit(chat);
            setNewChatTitle(chat.title);
            setIsRenameDialogOpen(true);
        }
    };

    // Handler to close Rename Dialog
    const handleCloseRenameDialog = () => {
        setIsRenameDialogOpen(false);
        setChatToEdit(null);
        setNewChatTitle('');
    };

    // Handler to confirm Rename
    const handleConfirmRename = () => {
        if (newChatTitle.trim() !== '') {
            onEditChat(chatToEdit.id, newChatTitle.trim());
            handleCloseRenameDialog();
        }
    };

    // Handler to open Delete Dialog
    const handleOpenDeleteDialog = (chatId) => {
        const chat = chats.find((c) => c.id === chatId);
        if (chat) {
            setChatToDelete(chat);
            setIsDeleteDialogOpen(true);
        }
    };

    // Handler to close Delete Dialog
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setChatToDelete(null);
    };

    // Handler to confirm Delete
    const handleConfirmDelete = () => {
        onDeleteChat(chatToDelete.id);
        handleCloseDeleteDialog();
    };

    return (
        <>
            <List>
                {chats.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" align="center" p={2}>
                        No chats.
                    </Typography>
                ) : (
                    chats.map((chat) => (
                        <SidebarItem
                            key={chat.id}
                            id={chat.id}
                            title={chat.title}
                            selected={chat.id === selectedChatId}
                            onEdit={handleOpenRenameDialog}
                            onDelete={handleOpenDeleteDialog}
                            onClick={onSelectChat}
                        />
                    ))
                )}
            </List>

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
                    <Button onClick={handleConfirmRename} variant="contained" color="primary">
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
                        <strong>{chatToDelete?.title}</strong>"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
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
};

export default SidebarItems;
