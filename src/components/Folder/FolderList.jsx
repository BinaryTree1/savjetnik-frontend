// src/components/FolderList.jsx
import React from 'react';
import { List } from '@mui/material';
import FolderItem from './FolderItem.jsx';
import useStore from '../../store/index.jsx';

const FolderList = ({
  parentId = null,
  filterFolders = () => true,
  onAddFolder,
  level = 0,
  visitedIds = new Set(),
}) => {
  const folders = useStore((state) => state.folders);

  const filteredFolders = folders
    .filter((folder) => folder.parentId === parentId && filterFolders(folder))
    .sort((a, b) => a.name.localeCompare(b.name)); // Optional: Sort folders alphabetically

  return (
    <List>
      {filteredFolders.map((folder) => {
        // Check for cyclic references
        if (visitedIds.has(folder.id)) {
          console.error(
            `Detected cyclic folder structure with folder id ${folder.id}.`
          );
          return null; // Prevent rendering this folder to avoid infinite loop
        }

        // Add current folder to visited set
        const newVisitedIds = new Set(visitedIds);
        newVisitedIds.add(folder.id);

        return (
          <FolderItem
            key={folder.id}
            folder={folder}
            level={level}
            filterFolders={filterFolders}
            onAddFolder={onAddFolder}
            visitedIds={newVisitedIds}
          />
        );
      })}
    </List>
  );
};

export default FolderList;
