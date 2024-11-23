// src/components/MoreOptionsMenu.jsx
import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import useStore from '../../store/index.jsx';

const MoreOptionsMenu = ({ anchorEl, open, onClose, folder }) => {
    const updateFolder = useStore((state) => state.updateFolder);
    const deleteFolder = useStore((state) => state.deleteFolder);
    const folders = useStore((state) => state.folders);

    /**
     * Initiates editing mode for the folder.
     */
    const handleEdit = () => {
        // Implement editing logic or propagate to parent
        // For simplicity, using inline editing in FolderItem
        onClose();
        // Could use a global state or callback to inform FolderItem to enter edit mode
    };

    /**
     * Handles confirming the deletion of a folder.
     * Prevents deletion if the folder contains subfolders.
     */
    const handleDelete = () => {
        // Check if the folder has subfolders before deleting
        const hasChildren = folders.some((f) => f.parentId === folder.id);
        if (hasChildren) {
            alert('Cannot delete a folder that contains subfolders.');
        } else {
            deleteFolder(folder.id);
        }
        onClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
            <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ marginRight: 1 }} />
                Edit
            </MenuItem>
            <MenuItem onClick={handleDelete}>
                <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
                Delete
            </MenuItem>
        </Menu>
    );
};

export default MoreOptionsMenu;
