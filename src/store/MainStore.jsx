// src/store/index.jsx
import { create } from 'zustand';
import { createSidebarSlice } from './SidebarStore';
import { createViewSlice } from './ViewStore';
import { createChatSlice } from './ChatStore';
import { createFolderSlice } from './FolderStore';

const useStore = create((set, get) => ({
    ...createSidebarSlice(set),
    ...createViewSlice(set),
    ...createChatSlice(set, get),
    ...createFolderSlice(set),
}));

export default useStore;
