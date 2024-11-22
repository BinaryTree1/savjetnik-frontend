// src/components/Sidebar/SidebarItem.jsx
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
 * SidebarItem Component
 *
 * Renders a chat item in the sidebar with options to edit or delete the chat.
 * Enhances performance and accessibility by utilizing memoization and proper ARIA attributes.
 *
 * @param {Object} props - Component props.
 * @param {number} props.id - Unique identifier for the chat.
 * @param {string} props.title - Title of the chat.
 * @param {boolean} props.selected - Whether the chat is currently selected.
 * @param {Function} props.onEdit - Handler to open the edit dialog.
 * @param {Function} props.onDelete - Handler to open the delete dialog.
 * @param {Function} props.onClick - Handler to select the chat.
 */
const SidebarItem = React.memo(
  ({
    id,
    title,
    selected,
    onEdit = () => {},
    onDelete = () => {},
    onClick = () => {},
  }) => {
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
    const buttonId = `sidebar-item-button-${id}`;
    const menuId = `sidebar-item-menu-${id}`;

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
        aria-label={`Chat titled ${title}`}
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

SidebarItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
};

export default SidebarItem;
