// src/components/Sidebar/SidebarSearch.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

/**
 * StyledTextField
 *
 * A styled version of MUI's TextField to match the desired aesthetics.
 */
const StyledTextField = styled(TextField)(({ theme }) => ({
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        '& fieldset': {
            border: 'none',
        },
        '&.Mui-focused fieldset': {
            border: 'none',
        },
    },
}));

/**
 * SidebarSearch Component
 *
 * Renders a search input field with a search icon and a clear button.
 *
 * @param {Object} props - Component props.
 * @param {string} props.searchQuery - The current search query.
 * @param {Function} props.onSearchChange - Handler for search input changes.
 * @param {Function} [props.onClear] - Handler to clear the search input.
 * @param {string} [props.placeholder] - Placeholder text for the search input.
 * @param {React.ReactNode} [props.startIcon] - Custom start adornment icon.
 */
const SidebarSearch = ({
                           searchQuery,
                           onSearchChange,
                           onClear,
                           placeholder = 'Search chats',
                           startIcon = <SearchIcon />,
                       }) => {
    const theme = useTheme();

    /**
     * Handler for input changes, directly invoking the onSearchChange prop.
     */
    const handleChange = (event) => {
        onSearchChange(event);
    };

    /**
     * Handler to clear the search input.
     * Invokes the onClear prop if provided.
     */
    const handleClear = () => {
        if (onClear) {
            onClear();
        }
    };

    return (
        <Box px={2} py={1}>
            <StyledTextField
                variant="outlined"
                size="small"
                placeholder={placeholder}
                value={searchQuery}
                onChange={handleChange}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">{startIcon}</InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="Clear search"
                                onClick={handleClear}
                                edge="end"
                                size="small"
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: {
                        '& input': {
                            padding: '10px 12px',
                        },
                    },
                }}
                aria-label="Search Chats"
            />
        </Box>
    );
};

SidebarSearch.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onClear: PropTypes.func,
    placeholder: PropTypes.string,
    startIcon: PropTypes.node,
};

export default React.memo(SidebarSearch);
