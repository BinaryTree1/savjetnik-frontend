// src/components/Sidebar/SidebarSearch.jsx
import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SidebarSearch = ({ searchQuery, onSearchChange }) => {
    return (
        <Box px={2} py={1}>
            <TextField
                variant="outlined"
                size="small"
                placeholder="Search chats"
                value={searchQuery}
                onChange={onSearchChange}
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    sx: {
                        '& fieldset': {
                            border: 'none',
                        },
                    },
                }}
                sx={{
                    borderRadius: '8px',
                }}
                aria-label="Search Chats"
            />
        </Box>
    );
};

export default SidebarSearch;
