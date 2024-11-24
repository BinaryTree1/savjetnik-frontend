// src/store/index.jsx
import { create } from 'zustand';

const useStore = create((set, get) => ({
    // Sidebar State
    isSidebarOpen: true,
    toggleSidebar: () =>
        set((state) => ({
            isSidebarOpen: !state.isSidebarOpen,
        })),

    // View State
    isFolderView: false,
    setIsFolderView: (isFolderView) => set({ isFolderView }),
    toggleFolderView: () =>
        set((state) => ({
            isFolderView: !state.isFolderView,
        })),

    // Chats State
    chats: [
        {
            id: 1,
            title: 'Welcome Chat',
            messages: [{ text: 'Hello!', sender: 'bot' }],
        },
        {
            id: 2,
            title: 'Project Discussion',
            messages: [{ text: "Let's discuss the project.", sender: 'user' }],
        },
        // Add more initial chats as needed
    ],
    selectedChatId: 1,

    addChat: () => {
        const chats = get().chats;
        const newChatId =
            chats.length > 0
                ? Math.max(...chats.map((chat) => chat.id)) + 1
                : 1;
        const newChat = { id: newChatId, title: 'New Chat', messages: [] };
        set((state) => ({
            chats: [newChat, ...state.chats],
            selectedChatId: newChatId,
        }));
        get().initializeUnfolderedChats();
    },

    editChat: (chatId, newTitle) =>
        set((state) => ({
            chats: state.chats.map((chat) =>
                chat.id === chatId ? { ...chat, title: newTitle } : chat
            ),
        })),

    deleteChat: (chatId) =>
        set((state) => {
            const updatedChats = state.chats.filter(
                (chat) => chat.id !== chatId
            );
            const selectedChatId =
                state.selectedChatId === chatId
                    ? updatedChats[0]?.id || null
                    : state.selectedChatId;

            // Remove chat from any folder it might be in
            const updatedFolders = state.folders.map((folder) => ({
                ...folder,
                chatIds: folder.chatIds.filter((id) => id !== chatId),
            }));

            return {
                chats: updatedChats,
                selectedChatId,
                folders: updatedFolders,
            };
        }),

    selectChat: (chatId) => set({ selectedChatId: chatId }),

    sendMessage: (messageText) => {
        const selectedChatId = get().selectedChatId;
        if (!selectedChatId) return;
        set((state) => {
            const updatedChats = state.chats.map((chat) => {
                if (chat.id === selectedChatId) {
                    const isFirstMessage = chat.messages.length === 0;
                    const updatedMessages = [
                        ...chat.messages,
                        { text: messageText, sender: 'user' },
                    ];
                    const updatedTitle = isFirstMessage
                        ? messageText.split(' ').slice(0, 3).join(' ')
                        : chat.title;
                    return {
                        ...chat,
                        messages: updatedMessages,
                        title: updatedTitle,
                    };
                }
                return chat;
            });
            return { chats: updatedChats };
        });

        // Simulate bot response
        setTimeout(() => {
            set((state) => {
                const updatedChats = state.chats.map((chat) => {
                    if (chat.id === selectedChatId) {
                        const updatedMessages = [
                            ...chat.messages,
                            { text: 'This is a bot response.', sender: 'bot' },
                        ];
                        return { ...chat, messages: updatedMessages };
                    }
                    return chat;
                });
                return { chats: updatedChats };
            });
        }, 1000);
    },

    // Folders State
    folders: [
        {
            id: 1,
            name: 'Root',
            chatIds: [],
            parentId: null,
            isExpanded: true,
        },
        // Add more initial folders as needed
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

    // Unfoldered Chats (chats not in any folder)
    unfolderedChats: [],

    // New action to recursively toggle folder expansion
    toggleFolderExpansion: (folderId, isExpanded) => {
        // Helper function to get all descendant folder IDs
        const getDescendantFolderIds = (folders, parentId) => {
            let descendantIds = [];
            folders.forEach((folder) => {
                if (folder.parentId === parentId) {
                    descendantIds.push(folder.id);
                    // Recursively collect descendants
                    const childDescendants = getDescendantFolderIds(
                        folders,
                        folder.id
                    );
                    descendantIds = descendantIds.concat(childDescendants);
                }
            });
            return descendantIds;
        };

        // Update the state immutably
        set((state) => {
            const foldersCopy = [...state.folders];

            // Get all descendant folder IDs
            const descendantIds = getDescendantFolderIds(foldersCopy, folderId);

            // Update the `isExpanded` state for the folder and its descendants
            const updatedFolders = foldersCopy.map((folder) => {
                if (
                    folder.id === folderId ||
                    descendantIds.includes(folder.id)
                ) {
                    return { ...folder, isExpanded };
                }
                return folder;
            });

            // Return the new state
            return { ...state, folders: updatedFolders };
        });
    },

    addChatToFolder: (chatId, folderId) => {
        set((state) => {
            const folders = state.folders.map((folder) => {
                if (folder.id === folderId) {
                    // Ensure chat isn't already in the folder
                    if (!folder.chatIds.includes(chatId)) {
                        return {
                            ...folder,
                            chatIds: [...folder.chatIds, chatId],
                            isExpanded: true, // Expand folder to show the new chat
                        };
                    }
                } else {
                    // Remove chat from other folders if necessary
                    return {
                        ...folder,
                        chatIds: folder.chatIds.filter((id) => id !== chatId),
                    };
                }
                return folder;
            });
            return { folders };
        });
        get().initializeUnfolderedChats(); // Update unfoldered chats
    },

    // Action to remove a chat from all folders
    removeChatFromFolders: (chatId) => {
        set((state) => {
            const folders = state.folders.map((folder) => ({
                ...folder,
                chatIds: folder.chatIds.filter((id) => id !== chatId),
            }));
            return { folders };
        });
    },

    // Initialize unfolderedChats with all chats (since chats remain in the sidebar)
    initializeUnfolderedChats: () => {
        const chats = get().chats;
        const folders = get().folders;
        const folderedChatIds = folders.flatMap(
            (folder) => folder.chatIds || []
        );
        const unfolderedChats = chats
            .map((chat) => chat.id)
            .filter((id) => !folderedChatIds.includes(id));
        set({ unfolderedChats });
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
}));

export default useStore;
