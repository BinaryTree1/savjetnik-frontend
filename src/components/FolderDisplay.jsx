// src/components/FolderDisplay.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    IconButton,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
    Paper,
    Menu,
    MenuItem,
    Stack,
    InputAdornment,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Search as SearchIcon,
    CreateNewFolder as CreateNewFolderIcon,
    Edit as EditIcon, // **Imported EditIcon**
    Delete as DeleteIcon, // **Imported DeleteIcon**
} from '@mui/icons-material';
import useStore from '../store';

/**
 * FolderDisplay Component
 * Handles the display and management of folders, including adding, editing,
 * deleting, and searching folders. Implements recursive rendering with safeguards
 * against infinite loops caused by cyclic folder structures.
 */
const FolderDisplay = () => {
    // Zustand store actions and state
    const folders = useStore((state) => state.folders);
    const addFolder = useStore((state) => state.addFolder);
    const updateFolder = useStore((state) => state.updateFolder);
    const deleteFolder = useStore((state) => state.deleteFolder);

    // Local component state
    const [open, setOpen] = useState(false); // Controls the Add Folder dialog
    const [newFolderName, setNewFolderName] = useState(''); // New folder name input
    const [editingFolder, setEditingFolder] = useState(null); // Folder ID being edited
    const [editingFolderName, setEditingFolderName] = useState(''); // Edited folder name
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for the More Options menu
    const [selectedFolder, setSelectedFolder] = useState(null); // Currently selected folder for menu actions
    const [selectedParentFolder, setSelectedParentFolder] = useState(null); // Parent folder ID for adding subfolders
    const [searchQuery, setSearchQuery] = useState(''); // Search input

    // Ref to focus the TextField when editing starts
    const inputRef = useRef(null);

    // Focus the input when a folder enters edit mode
    useEffect(() => {
        if (editingFolder !== null && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingFolder]);

    /**
     * Handles adding a new folder.
     * Prevents a folder from being its own parent to avoid cyclic structures.
     * @param {number|null} parentId - The ID of the parent folder. Null for root folders.
     */
    const handleAddFolder = (parentId = null) => {
        if (newFolderName.trim() === '') {
            alert('Folder name cannot be empty.');
            return;
        }

        const newFolderId = folders.length > 0 ? Math.max(...folders.map((f) => f.id)) + 1 : 1;

        // Prevent setting parentId equal to the new folder's id
        if (parentId === newFolderId) {
            alert("A folder cannot be its own parent.");
            return;
        }

        const newFolder = {
            id: newFolderId,
            name: newFolderName.trim(),
            chatIds: [],
            parentId: parentId,
            isExpanded: true,
        };

        addFolder(newFolder);
        setNewFolderName('');
        setOpen(false);
    };

    /**
     * Recursively renders folders and their subfolders.
     * Utilizes a visitedIds set to prevent infinite loops due to cyclic references.
     * @param {number|null} parentId - The ID of the parent folder.
     * @param {number} level - The current depth level for indentation.
     * @param {Set<number>} visitedIds - A set of folder IDs already visited in this branch.
     * @returns {JSX.Element[]} - An array of JSX elements representing folders.
     */
    const renderFolders = (parentId = null, level = 0, visitedIds = new Set()) => {
        return folders
            .filter((folder) => folder.parentId === parentId && filterFolders(folder))
            .map((folder) => {
                // Check for cyclic references
                if (visitedIds.has(folder.id)) {
                    console.error(`Detected cyclic folder structure with folder id ${folder.id}.`);
                    return null; // Prevent rendering this folder to avoid infinite loop
                }

                // Add current folder to visited set
                const newVisitedIds = new Set(visitedIds);
                newVisitedIds.add(folder.id);

                return (
                    <Box key={folder.id}>
                        <ListItem
                            sx={{
                                pl: 2 * level, // Indentation based on level
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                {/* Indentation marker for nested folders */}
                                {folder.parentId !== null && (
                                    <Typography variant="body1" sx={{ mr: 0.5 }}>
                                        |
                                    </Typography>
                                )}

                                {/* Expand/Collapse Icon */}
                                <IconButton
                                    size="small"
                                    onClick={() => toggleFolder(folder.id)}
                                    sx={{ mr: 1 }}
                                    aria-label={
                                        folder.isExpanded ? 'Collapse folder' : 'Expand folder'
                                    }
                                >
                                    {folder.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>

                                {/* Folder Icon */}
                                {folder.isExpanded ? (
                                    <FolderOpenIcon sx={{ mr: 1 }} />
                                ) : (
                                    <FolderIcon sx={{ mr: 1 }} />
                                )}

                                {/* Folder Name or Edit Input */}
                                {editingFolder === folder.id ? (
                                    <TextField
                                        value={editingFolderName}
                                        onChange={(e) => setEditingFolderName(e.target.value)}
                                        onBlur={() => handleSaveFolderName(folder.id)}
                                        onKeyDown={(e) => handleKeyDown(e, folder.id)}
                                        variant="standard"
                                        inputRef={inputRef}
                                        sx={{ mr: 1, minWidth: '150px' }}
                                        aria-label="Edit Folder Name"
                                    />
                                ) : (
                                    <Typography
                                        variant="body1"
                                        onDoubleClick={() =>
                                            handleDoubleClick(folder.id, folder.name)
                                        }
                                        sx={{
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                            mr: 1,
                                        }}
                                    >
                                        {folder.name}
                                    </Typography>
                                )}

                                {/* Add Subfolder Button */}
                                <Tooltip title="Add Subfolder">
                                    <IconButton
                                        size="small"
                                        sx={{ ml: 1 }}
                                        onClick={() => {
                                            setSelectedParentFolder(folder.id);
                                            setOpen(true);
                                        }}
                                        aria-label="Add subfolder"
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* More Options Button (Edit/Delete) */}
                            {folder.id !== 1 && ( // Assuming folder with id=1 is the root and cannot be edited/deleted
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, folder)}
                                    aria-label="More options"
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            )}
                        </ListItem>

                        {/* Recursive Rendering of Subfolders */}
                        {folder.isExpanded && renderFolders(folder.id, level + 1, newVisitedIds)}
                    </Box>
                );
            });
    };

    /**
     * Toggles the expanded state of a folder.
     * @param {number} folderId - The ID of the folder to toggle.
     */
    const toggleFolder = (folderId) => {
        const updatedFolder = folders.find((folder) => folder.id === folderId);
        if (updatedFolder) {
            updateFolder({
                ...updatedFolder,
                isExpanded: !updatedFolder.isExpanded,
            });
        }
    };

    /**
     * Handles opening the More Options menu for a folder.
     * @param {React.MouseEvent} event - The click event.
     * @param {Object} folder - The folder object.
     */
    const handleMenuOpen = (event, folder) => {
        event.stopPropagation(); // Prevent triggering parent onClick
        setAnchorEl(event.currentTarget);
        setSelectedFolder(folder);
    };

    /**
     * Closes the More Options menu.
     */
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedFolder(null);
    };

    /**
     * Initiates editing mode for a folder.
     * @param {number} folderId - The ID of the folder to edit.
     * @param {string} folderName - The current name of the folder.
     */
    const handleDoubleClick = (folderId, folderName) => {
        setEditingFolder(folderId);
        setEditingFolderName(folderName);
    };

    /**
     * Saves the edited folder name.
     * @param {number} folderId - The ID of the folder being edited.
     */
    const handleSaveFolderName = (folderId) => {
        const trimmedName = editingFolderName.trim();
        if (trimmedName === '') {
            alert('Folder name cannot be empty.');
            return;
        }

        const updatedFolder = folders.find((folder) => folder.id === folderId);
        if (updatedFolder) {
            updateFolder({
                ...updatedFolder,
                name: trimmedName,
            });
        }
        setEditingFolder(null);
        setEditingFolderName('');
    };

    /**
     * Handles key presses in the edit TextField.
     * @param {React.KeyboardEvent} e - The keyboard event.
     * @param {number} folderId - The ID of the folder being edited.
     */
    const handleKeyDown = (e, folderId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveFolderName(folderId);
        } else if (e.key === 'Escape') {
            setEditingFolder(null);
            setEditingFolderName('');
        }
    };

    /**
     * Handles confirming the deletion of a folder.
     * Prevents deletion if the folder contains subfolders.
     */
    const handleConfirmDelete = () => {
        if (!selectedFolder) return;

        // Check if the folder has subfolders before deleting
        const hasChildren = folders.some((f) => f.parentId === selectedFolder.id);
        if (hasChildren) {
            alert('Cannot delete a folder that contains subfolders.');
        } else {
            deleteFolder(selectedFolder.id);
        }
        handleMenuClose();
    };

    /**
     * Filters folders based on the search query.
     * @param {Object} folder - The folder object.
     * @returns {boolean} - Whether the folder matches the search query.
     */
    const filterFolders = (folder) => {
        if (searchQuery.trim() === '') return true;
        return folder.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    };

    /**
     * Handles changes in the search input.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                bgcolor: 'background.default',
                width: {
                    xs: '100%',
                    sm: '90%',
                    md: '80%',
                    lg: '60%',
                },
            }}
        >
            <Stack spacing={3} sx={{ pt: 6 }}>
                {/* Search and Add Root Folder */}
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden',
                    }}
                >
                    {/* Search Input */}
                    <TextField
                        variant="standard"
                        placeholder="Search folders"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start" sx={{ ml: 1 }}>
                                    <SearchIcon sx={{ color: 'action.active' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: 1,
                            '& .MuiInputBase-root': {
                                pl: 0,
                            },
                            '& .MuiInputBase-input': {
                                py: 1,
                                px: 1,
                            },
                        }}
                        aria-label="Search Folders"
                    />

                    {/* Add Root Folder Button */}
                    <Tooltip title="Add Root Folder">
                        <IconButton
                            onClick={() => {
                                setSelectedParentFolder(null);
                                setOpen(true);
                            }}
                            sx={{
                                borderLeft: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 0,
                                px: 1,
                            }}
                            aria-label="Add root folder"
                        >
                            <CreateNewFolderIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Folder List */}
                <List>{renderFolders()}</List>
            </Stack>

            {/* More Options Menu (Edit/Delete) */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        setEditingFolder(selectedFolder.id);
                        setEditingFolderName(selectedFolder.name);
                        handleMenuClose();
                    }}
                >
                    <EditIcon fontSize="small" sx={{ marginRight: 1 }} /> {/* **Using EditIcon */}
                    Edit
                </MenuItem>
                <MenuItem onClick={handleConfirmDelete}>
                    <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} /> {/* **Using DeleteIcon */}
                    Delete
                </MenuItem>
            </Menu>

            {/* Add Folder Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Folder Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        inputProps={{
                            maxLength: 50,
                        }}
                        helperText={`${newFolderName.length}/50`}
                        aria-label="Folder Name"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => handleAddFolder(selectedParentFolder)}
                        disabled={newFolderName.trim() === ''}
                    >
                        Add Folder
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default FolderDisplay;
