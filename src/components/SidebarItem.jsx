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

const SidebarItem = ({
                         id,
                         title,
                         selected,
                         onEdit = () => {},
                         onDelete = () => {},
                         onClick = () => {},
                     }) => {
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

    const handleItemClick = () => {
        onClick(id);
    };

    return (
        <ListItemButton
            onClick={handleItemClick} // Call the onClick handler with the item's id
            sx={{
                paddingLeft: 2,
                paddingRight: 2,
                bgcolor: selected ? 'action.selected' : 'inherit',
                '&:hover': {
                    bgcolor: 'action.hover',
                },
            }}
        >
            <ListItemText primary={title} />
            <IconButton
                edge="end"
                aria-label="more"
                onClick={handleMenuOpen}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
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
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
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

export default SidebarItem;
