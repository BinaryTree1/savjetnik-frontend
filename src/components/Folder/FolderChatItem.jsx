// src/components/FolderChatItem.jsx

import React, { useState, useCallback } from 'react';
import {
    ListItemButton,
    ListItemText,
    ListItemIcon, // Import ListItemIcon
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
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import useStore from '../../store/index.jsx';
/**
 * FolderChatItem Component
 *
 * Represents a chat item within a folder.
 * It can have different styling or functionalities compared to SidebarItem.
 */
const FolderChatItem = React.memo(
    ({ id, title, selected, onEdit, onDelete, onClick, level }) => {
        const selectChat = useStore((state) => state.selectChat);
        const setIsFolderView = useStore((state) => state.setIsFolderView);

        const handleItemDoubleClick = useCallback(() => {
            selectChat(id); // Set the selected chat ID
            setIsFolderView(false); // Switch to ChatWindow
        }, [id, selectChat, setIsFolderView]);

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
                onDoubleClick={handleItemDoubleClick}
                selected={selected}
                sx={{
                    pl: 2 * level + 1.5, // Align with folder items
                    pr: 2,
                    bgcolor: selected ? 'action.selected' : 'inherit',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    },
                    transition: 'background-color 0.3s',
                    // Align the chat icon with folder icons
                    '& .MuiListItemIcon-root': {
                        minWidth: 24,
                        mr: 1,
                        ml: '28px', // Width of expand/collapse button
                    },
                }}
                aria-label={`Folder chat titled ${title}`}
            >
                {/* Message Icon */}
                <ListItemIcon sx={{ minWidth: 'unset', mr: 1 }}>
                    <ChatBubbleOutlineIcon />
                </ListItemIcon>

                {/* Chat Title */}
                <ListItemText
                    primary={
                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {title || 'Untitled Chat'}
                        </Typography>
                    }
                />

                {/* More Options Button */}
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

                {/* More Options Menu */}
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
    level: PropTypes.number.isRequired, // Include level in propTypes
};

export default FolderChatItem;
