// src/components/FolderItem.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    ListItem,
    IconButton,
    TextField,
    Tooltip,
    List,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import useStore from '../../store/index.jsx';
import FolderList from './FolderList.jsx';
import MoreOptionsMenu from './MoreOptionsMenu.jsx';
import FolderChatItem from './FolderChatItem.jsx';

/**
 * FolderItem Component
 *
 * Represents a single folder, which can contain chats and subfolders.
 * Supports dragging and dropping chats into it.
 */
const FolderItem = ({
    folder,
    level,
    filterFolders,
    onAddFolder,
    visitedIds,
}) => {
    // Access the toggleFolderExpansion action from the store
    const toggleFolderExpansion = useStore(
        (state) => state.toggleFolderExpansion
    );

    const chats = useStore((state) => state.chats);
    const selectedChatId = useStore((state) => state.selectedChatId);
    const selectChat = useStore((state) => state.selectChat);
    const editChat = useStore((state) => state.editChat);
    const deleteChat = useStore((state) => state.deleteChat);
    const updateFolder = useStore((state) => state.updateFolder);

    // Local state for editing folder name
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
     * Toggles the expanded state of the folder and all its descendants.
     */
    const toggleFolder = () => {
        const newIsExpanded = !folder.isExpanded;
        toggleFolderExpansion(folder.id, newIsExpanded);
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

        // Update the folder name in the store
        updateFolder({
            ...folder,
            name: trimmedName,
        });
        setIsEditing(false);
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

    return (
        <Box key={folder.id}>
            {/* Folder Header */}
            <ListItem
                sx={{
                    pl: 2 * level, // Base indentation based on level
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: 1,
                    mb: 1,
                }}
            >
                <Box display="flex" alignItems="center" sx={{ minWidth: 0 }}>
                    {/* Expand/Collapse Icon */}
                    <IconButton
                        size="small"
                        onClick={toggleFolder}
                        sx={{ mr: 1 }}
                        aria-label={
                            folder.isExpanded
                                ? 'Collapse folder'
                                : 'Expand folder'
                        }
                    >
                        {folder.isExpanded ? (
                            <ExpandLessIcon />
                        ) : (
                            <ExpandMoreIcon />
                        )}
                    </IconButton>

                    {/* Folder Icon - Aligned with chat icons */}
                    <Box
                        sx={{
                            width: 24,
                            display: 'flex',
                            justifyContent: 'center',
                            mr: 1,
                        }}
                    >
                        {folder.isExpanded ? (
                            <FolderOpenIcon color="action" />
                        ) : (
                            <FolderIcon />
                        )}
                    </Box>

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
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
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

                {/* More Options Button */}
                {folder.id !== 1 && (
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
                    onEdit={(folderId, folderName) => {
                        setIsEditing(true);
                        setEditedName(folderName);
                    }}
                />
            )}

            {/* Droppable Area for Chats */}
            <Droppable droppableId={`folder-${folder.id}`} type="CHAT">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            backgroundColor: snapshot.isDraggingOver
                                ? '#e3f2fd'
                                : 'inherit',
                            paddingLeft: 2 * (level + 1), // Indentation for chats
                            paddingTop: 4,
                            paddingBottom: 4,
                        }}
                    >
                        {/* Render Chats in Folder */}
                        {folder.isExpanded &&
                            folder.chatIds &&
                            folder.chatIds.length > 0 && (
                                <List disablePadding>
                                    {folder.chatIds.map((chatId, index) => {
                                        const chat = chats.find(
                                            (c) => c.id === chatId
                                        );
                                        if (!chat) return null;
                                        return (
                                            <Draggable
                                                key={`folder-chat-${chat.id.toString()}`}
                                                draggableId={`folder-chat-${chat.id}`}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided
                                                                .draggableProps
                                                                .style,
                                                            opacity:
                                                                snapshot.isDragging
                                                                    ? 0.5
                                                                    : 1,
                                                        }}
                                                    >
                                                        <FolderChatItem
                                                            id={chat.id}
                                                            title={
                                                                chat.title ||
                                                                'Untitled Chat'
                                                            }
                                                            selected={
                                                                chat.id ===
                                                                selectedChatId
                                                            }
                                                            onEdit={editChat}
                                                            onDelete={
                                                                deleteChat
                                                            }
                                                            onClick={selectChat}
                                                            level={level + 1} // Pass the level prop
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                </List>
                            )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

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
