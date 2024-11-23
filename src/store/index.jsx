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

    // Initialize unfolderedChats with all chat IDs not in folders
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
}));

export default useStore;
