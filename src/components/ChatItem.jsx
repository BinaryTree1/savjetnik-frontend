// components/ChatItem.jsx
import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const ChatItem = ({ id, title, onEdit, onDelete, onClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // Prevent the parent onClick
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(id);
    handleMenuClose();
  };

  return (
      <ListItem button onClick={() => onClick(id)}>
        <ListItemText
            primary={title}
            primaryTypographyProps={{
              variant: 'body1',
              color: 'text.primary',
            }}
        />

        {/* Three-Dot Menu Icon */}
        <IconButton
            aria-label="more options"
            aria-controls={open ? 'chat-item-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuOpen}
            size="small"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>

        {/* Menu */}
        <Menu
            id="chat-item-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 150,
                '& .MuiMenuItem-root': {
                  paddingY: 1,
                  paddingX: 2,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
      </ListItem>
  );
};

ChatItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
};

export default ChatItem;
