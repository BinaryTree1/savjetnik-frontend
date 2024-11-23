// src/components/AddFolderDialog.jsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';

const AddFolderDialog = ({ open, onClose, onAdd, parentId }) => {
    const [folderName, setFolderName] = useState('');

    /**
     * Handles adding the folder and resetting the input.
     */
    const handleAdd = () => {
        onAdd(folderName);
        setFolderName('');
        onClose();
    };

    /**
     * Handles closing the dialog and resetting the input.
     */
    const handleCancel = () => {
        setFolderName('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancel}>
            <DialogTitle>Add New Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    inputProps={{
                        maxLength: 50,
                    }}
                    helperText={`${folderName.length}/50`}
                    aria-label="Folder Name"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleAdd} disabled={folderName.trim() === ''}>
                    Add Folder
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFolderDialog;
