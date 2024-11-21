// FolderDisplay.jsx
import React, { useState, useContext } from 'react';
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
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { ThemeContext } from '@emotion/react';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
const FolderDisplay = ({
  chats,
  onEditChat,
  onDeleteChat,
  onSelectChat,
  onReorderChats,
}) => {
  const [folders, setFolders] = useState([
    {
      id: 1,
      name: 'Root',
      chatIds: [],
      parentId: null,
      isExpanded: true,
    },
  ]);
  const [open, setOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedParentFolder, setSelectedParentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { themeMode } = useContext(ThemeContext); // Utilize ThemeContext if needed

  const handleAddFolder = (parentId = null) => {
    if (newFolderName.trim() === '') return;

    const newFolder = {
      id: folders.length > 0 ? Math.max(...folders.map((f) => f.id)) + 1 : 1,
      name: newFolderName.trim(),
      chatIds: [],
      parentId: parentId,
      isExpanded: true,
    };

    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setOpen(false);
  };

  const handleMenuOpen = (event, folder) => {
    setAnchorEl(event.currentTarget);
    setSelectedFolder(folder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFolder(null);
  };

  const toggleFolder = (folderId) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === folderId
          ? { ...folder, isExpanded: !folder.isExpanded }
          : folder
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterFolders = (folder) => {
    if (searchQuery.trim() === '') return true;
    return folder.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
  };

  const renderFolders = (parentId = null, level = 0) => {
    return folders
      .filter((folder) => folder.parentId === parentId && filterFolders(folder))
      .map((folder) => (
        <Box key={folder.id}>
          <ListItem
            sx={{
              pl: 2 * level, // Consistent indentation
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box display="flex" alignItems="center">
              {/* Add '|' before icon for child folders only */}
              {folder.parentId !== null && (
                <Typography variant="body1" sx={{ mr: 0.5 }}>
                  |
                </Typography>
              )}
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
              {folder.isExpanded ? (
                <FolderOpenIcon sx={{ mr: 1 }} />
              ) : (
                <FolderIcon sx={{ mr: 1 }} />
              )}
              <Typography variant="body1">{folder.name}</Typography>

              <Tooltip title="Add Subfolder">
                <IconButton
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    setOpen(true);
                    setSelectedParentFolder(folder.id);
                  }}
                  aria-label="Add subfolder"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {folder.id !== 1 && (
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, folder)}
                aria-label="More options"
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </ListItem>

          {folder.isExpanded && renderFolders(folder.id, level + 1)}
        </Box>
      ));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: 'background.default',
        width: {
          xs: '100%', // Full width on phones
          sm: '90%', // 90% on small tablets
          md: '80%', // 80% on tablets
          lg: '60%', // 60% on larger screens
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
          />
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
            >
              <CreateNewFolderIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Folder List */}
        <List>{renderFolders()}</List>
      </Stack>

      {/* Menu for Edit/Delete */}
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
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            // Check if the folder has subfolders before deleting
            const hasChildren = folders.some(
              (f) => f.parentId === selectedFolder.id
            );
            if (hasChildren) {
              alert('Cannot delete a folder that contains subfolders.');
            } else {
              setFolders((prevFolders) =>
                prevFolders.filter((folder) => folder.id !== selectedFolder.id)
              );
            }
            handleMenuClose();
          }}
        >
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

      {/* Edit Folder Dialog */}
      {editingFolder !== null && (
        <Dialog
          open={editingFolder !== null}
          onClose={() => setEditingFolder(null)}
        >
          <DialogTitle>Edit Folder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Folder Name"
              type="text"
              fullWidth
              variant="standard"
              value={editingFolderName}
              onChange={(e) => setEditingFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingFolder(null)}>Cancel</Button>
            <Button
              onClick={() => {
                setFolders((prevFolders) =>
                  prevFolders.map((folder) =>
                    folder.id === editingFolder
                      ? { ...folder, name: editingFolderName }
                      : folder
                  )
                );
                setEditingFolder(null);
              }}
              disabled={editingFolderName.trim() === ''}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

FolderDisplay.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      messages: PropTypes.array.isRequired,
    })
  ).isRequired,
  onEditChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired,
  onSelectChat: PropTypes.func.isRequired,
  onReorderChats: PropTypes.func.isRequired,
};

export default FolderDisplay;
