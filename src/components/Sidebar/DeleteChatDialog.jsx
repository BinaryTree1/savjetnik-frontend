// src/components/Sidebar/DeleteChatDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * DeleteChatDialog Component
 *
 * A dialog that prompts the user to confirm the deletion of a chat.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines if the dialog is open.
 * @param {Function} props.onClose - Function to call when the dialog is closed.
 * @param {string} [props.chatTitle=''] - The title of the chat to be deleted.
 * @param {Function} props.onConfirm - Function to call when deletion is confirmed.
 */
const DeleteChatDialog = ({ open, onClose, chatTitle = '', onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={false}
      aria-labelledby="delete-chat-dialog"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="delete-chat-dialog">Delete Chat</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete the chat "<strong>{chatTitle}</strong>
          "? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteChatDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  chatTitle: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteChatDialog;
