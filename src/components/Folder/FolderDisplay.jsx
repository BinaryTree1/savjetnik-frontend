// src/components/FolderDisplay.jsx
import React, { useState } from 'react';
import {
  Box,
  IconButton,
  TextField,
  Tooltip,
  Paper,
  Stack,
  InputAdornment,
} from '@mui/material';
import {
  CreateNewFolder as CreateNewFolderIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import useStore from '../../store/index.jsx';
import FolderList from './FolderList.jsx';
import AddFolderDialog from './AddFolderDialog.jsx';

const FolderDisplay = () => {
  // Zustand store actions and state
  const folders = useStore((state) => state.folders);
  const addFolder = useStore((state) => state.addFolder);

  // Local component state
  const [openAddDialog, setOpenAddDialog] = useState(false); // Controls the Add Folder dialog
  const [selectedParentFolder, setSelectedParentFolder] = useState(null); // Parent folder ID for adding subfolders
  const [searchQuery, setSearchQuery] = useState(''); // Search input

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
   * Handles opening the Add Folder dialog.
   * @param {number|null} parentId - The ID of the parent folder.
   */
  const handleOpenAddDialog = (parentId = null) => {
    setSelectedParentFolder(parentId);
    setOpenAddDialog(true);
  };

  /**
   * Handles adding a new folder.
   * @param {string} folderName - The name of the new folder.
   */
  const handleAddFolder = (folderName) => {
    if (folderName.trim() === '') {
      alert('Folder name cannot be empty.');
      return;
    }

    const newFolderId =
      folders.length > 0 ? Math.max(...folders.map((f) => f.id)) + 1 : 1;

    // Prevent setting parentId equal to the new folder's id
    if (selectedParentFolder === newFolderId) {
      alert('A folder cannot be its own parent.');
      return;
    }

    const newFolder = {
      id: newFolderId,
      name: folderName.trim(),
      chatIds: [],
      parentId: selectedParentFolder,
      isExpanded: true,
    };

    addFolder(newFolder);
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
              onClick={() => handleOpenAddDialog(null)}
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
        <FolderList
          filterFolders={filterFolders}
          onAddFolder={handleOpenAddDialog}
        />
      </Stack>

      {/* Add Folder Dialog */}
      <AddFolderDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={handleAddFolder}
        parentId={selectedParentFolder}
      />
    </Paper>
  );
};

export default FolderDisplay;
