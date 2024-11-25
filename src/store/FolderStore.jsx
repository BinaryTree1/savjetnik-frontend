// src/store/folderStore.js
export const createFolderSlice = (set) => ({
    folders: [
        {
            id: 1,
            name: 'Root',
            chatIds: [],
            parentId: null,
            isExpanded: true,
        },
    ],

    addFolder: (newFolder) =>
        set((state) => ({
            folders: [...state.folders, newFolder],
        })),

    updateFolder: (updatedFolder) =>
        set((state) => ({
            folders: state.folders.map((folder) =>
                folder.id === updatedFolder.id ? updatedFolder : folder
            ),
        })),

    deleteFolder: (folderId) =>
        set((state) => ({
            folders: state.folders.filter((folder) => folder.id !== folderId),
        })),

    toggleFolderExpansion: (folderId, isExpanded) => {
        const getDescendantFolderIds = (folders, parentId) => {
            let descendantIds = [];
            folders.forEach((folder) => {
                if (folder.parentId === parentId) {
                    descendantIds.push(folder.id);
                    const childDescendants = getDescendantFolderIds(
                        folders,
                        folder.id
                    );
                    descendantIds = descendantIds.concat(childDescendants);
                }
            });
            return descendantIds;
        };

        set((state) => {
            const foldersCopy = [...state.folders];
            const descendantIds = getDescendantFolderIds(foldersCopy, folderId);
            const updatedFolders = foldersCopy.map((folder) => {
                if (
                    folder.id === folderId ||
                    descendantIds.includes(folder.id)
                ) {
                    return { ...folder, isExpanded };
                }
                return folder;
            });
            return { folders: updatedFolders };
        });
    },

    addChatToFolder: (chatId, folderId) => {
        set((state) => {
            const folders = state.folders.map((folder) => {
                if (folder.id === folderId) {
                    if (!folder.chatIds.includes(chatId)) {
                        return {
                            ...folder,
                            chatIds: [...folder.chatIds, chatId],
                            isExpanded: true,
                        };
                    }
                } else {
                    return {
                        ...folder,
                        chatIds: folder.chatIds.filter((id) => id !== chatId),
                    };
                }
                return folder;
            });
            return { folders };
        });
    },

    removeChatFromFolder: (chatId, folderId) => {
        set((state) => {
            const folders = state.folders.map((folder) => {
                if (folder.id === folderId) {
                    return {
                        ...folder,
                        chatIds: folder.chatIds.filter((id) => id !== chatId),
                    };
                }
                return folder;
            });
            return { folders };
        });
    },
});
