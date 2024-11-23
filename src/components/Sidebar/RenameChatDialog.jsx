// src/components/Sidebar/RenameChatDialog.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import PropTypes from 'prop-types';

const RenameChatDialog = ({
    open,
    onClose,
    chatTitle,
    setChatTitle,
    onConfirm,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                    inputProps={{
                        maxLength: 50,
                    }}
                    helperText={`${chatTitle.length}/50`}
                    aria-label="Chat Name"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    disabled={chatTitle.trim() === ''}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

RenameChatDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    chatTitle: PropTypes.string.isRequired,
    setChatTitle: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default RenameChatDialog;
