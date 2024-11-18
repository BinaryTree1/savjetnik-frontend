// SidebarItem.jsx
import React from 'react';
import { ListItemButton, ListItemText, IconButton, Menu, MenuItem } from '@mui/material';
import {
    Edit as EditIcon,
    DeleteOutline as DeleteIcon,
    MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

const SidebarItem = ({ id, title, selected, onEdit, onDelete, onClick }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        event.stopPropagation(); // Prevent triggering parent onClick
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
        <ListItemButton
            selected={selected}
            onClick={() => onClick(id)} // Call the onClick handler with the item's id
            sx={{
                paddingLeft: 2,
                paddingRight: 2,
                bgcolor: selected ? 'action.selected' : 'inherit',
                '&:hover': {
                    bgcolor: 'action.hover',
                },
            }}
        >
            <ListItemText
                primary={title}
                primaryTypographyProps={{
                    variant: 'body1',
                    color: 'text.primary',
                }}
            />
            <IconButton
                aria-label="more options"
                aria-controls={open ? `sidebar-item-menu-${id}` : undefined}
                aria-haspopup="true"
                onClick={handleMenuOpen}
                size="small"
                sx={{
                    color: 'text.secondary',
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                id={`sidebar-item-menu-${id}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: { mt: 1.5 },
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
        </ListItemButton>
    );
};

SidebarItem.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onClick: PropTypes.func,
};

SidebarItem.defaultProps = {
    onEdit: () => {},
    onDelete: () => {},
    onClick: () => {},
};

export default SidebarItem;
