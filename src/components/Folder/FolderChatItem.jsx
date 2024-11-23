// src/components/FolderChatItem.jsx
import React, { useState, useCallback } from 'react';
import {
  ListItemButton,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * FolderChatItem Component
 *
 * Represents a chat item within a folder.
 * It can have different styling or functionalities compared to SidebarItem.
 */
const FolderChatItem = React.memo(
  ({ id, title, selected, onEdit, onDelete, onClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    /**
     * Opens the menu.
     * @param {React.MouseEvent<HTMLButtonElement>} event - The click event.
     */
    const handleMenuOpen = useCallback((event) => {
      event.stopPropagation(); // Prevent triggering parent onClick
      setAnchorEl(event.currentTarget);
    }, []);

    /**
     * Closes the menu.
     */
    const handleMenuClose = useCallback(() => {
      setAnchorEl(null);
    }, []);

    /**
     * Handles the edit action.
     */
    const handleEdit = useCallback(() => {
      onEdit(id);
      handleMenuClose();
    }, [id, onEdit, handleMenuClose]);

    /**
     * Handles the delete action.
     */
    const handleDelete = useCallback(() => {
      onDelete(id);
      handleMenuClose();
    }, [id, onDelete, handleMenuClose]);

    /**
     * Handles the click on the list item.
     */
    const handleItemClick = useCallback(() => {
      onClick(id);
    }, [id, onClick]);

    // Generate unique IDs for accessibility
    const buttonId = `folder-chat-item-button-${id}`;
    const menuId = `folder-chat-item-menu-${id}`;

    return (
      <ListItemButton
        onClick={handleItemClick}
        selected={selected}
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
          bgcolor: selected ? 'action.selected' : 'inherit',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          transition: 'background-color 0.3s',
        }}
        aria-label={`Folder chat titled ${title}`}
      >
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '85%',
              }}
            >
              {title || 'Untitled Chat'}
            </Typography>
          }
        />
        <IconButton
          edge="end"
          aria-label="more options"
          onClick={handleMenuOpen}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          id={buttonId}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={menuId}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          MenuListProps={{
            'aria-labelledby': buttonId,
          }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ marginRight: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </ListItemButton>
    );
  }
);

FolderChatItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
};

export default FolderChatItem;
