// src/components/FolderItem.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  ListItem,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import useStore from '../../store/index.jsx';
import FolderList from './FolderList.jsx';
import MoreOptionsMenu from './MoreOptionsMenu.jsx';

const FolderItem = ({
  folder,
  level,
  filterFolders,
  onAddFolder,
  visitedIds,
}) => {
  const updateFolder = useStore((state) => state.updateFolder);

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(folder.name);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  /**
   * Toggles the expanded state of the folder.
   */
  const toggleFolder = () => {
    updateFolder({
      ...folder,
      isExpanded: !folder.isExpanded,
    });
  };

  /**
   * Handles double-click to enter edit mode.
   */
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  /**
   * Saves the edited folder name.
   */
  const saveEdit = () => {
    const trimmedName = editedName.trim();
    if (trimmedName === '') {
      alert('Folder name cannot be empty.');
      return;
    }

    updateFolder({
      ...folder,
      name: trimmedName,
    });
    setIsEditing(false);
  };

  const handleEdit = (folderId, folderName) => {
    setIsEditing(true);
    setEditedName(folderName);
  };

  /**
   * Handles key presses in the edit TextField.
   * @param {React.KeyboardEvent} e - The keyboard event.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(folder.name);
    }
  };

  /**
   * Opens the More Options menu.
   * @param {React.MouseEvent} event - The click event.
   */
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the More Options menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            onClick={toggleFolder}
            sx={{ mr: 1 }}
            aria-label={folder.isExpanded ? 'Collapse folder' : 'Expand folder'}
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
          {isEditing ? (
            <TextField
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
              variant="standard"
              inputRef={inputRef}
              sx={{ mr: 1, minWidth: '150px' }}
              aria-label="Edit Folder Name"
            />
          ) : (
            <Typography
              variant="body1"
              onDoubleClick={handleDoubleClick}
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
              onClick={() => onAddFolder(folder.id)}
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
            onClick={handleMenuOpen}
            aria-label="More options"
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </ListItem>

      {/* More Options Menu */}
      {anchorEl && (
        <MoreOptionsMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          folder={folder}
          onEdit={handleEdit}
        />
      )}

      {/* Recursive Rendering of Subfolders */}
      {folder.isExpanded && (
        <FolderList
          parentId={folder.id}
          filterFolders={filterFolders}
          onAddFolder={onAddFolder}
          level={level + 1}
          visitedIds={visitedIds}
        />
      )}
    </Box>
  );
};

export default FolderItem;
