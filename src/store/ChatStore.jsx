// src/store/chatStore.js
export const createChatSlice = (set, get) => ({
    chats: [
        {
            id: 1,
            title: 'Welcome Chat',
            messages: [{ text: 'Hello!', sender: 'bot' }],
        },
        {
            id: 2,
            title: 'Project Discussion',
            messages: [{ text: "Let's discuss the project.", sender: 'bot' }],
        },
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

    editMessage: (index, newText) =>
        set((state) => {
            const selectedChatId = state.selectedChatId;
            const updatedChats = state.chats.map((chat) => {
                if (chat.id === selectedChatId) {
                    const updatedMessages = [...chat.messages];
                    updatedMessages[index] = {
                        ...updatedMessages[index],
                        text: newText,
                    };
                    return {
                        ...chat,
                        messages: updatedMessages,
                    };
                }
                return chat;
            });
            return { chats: updatedChats };
        }),

    deleteMessagesAfter: (index) =>
        set((state) => {
            const selectedChatId = state.selectedChatId;
            const updatedChats = state.chats.map((chat) => {
                if (chat.id === selectedChatId) {
                    const updatedMessages = chat.messages.slice(0, index);
                    return {
                        ...chat,
                        messages: updatedMessages,
                    };
                }
                return chat;
            });
            return { chats: updatedChats };
        }),

    // Reintroduced initializeUnfolderedChats
    initializeUnfolderedChats: () =>
        set((state) => {
            const chats = state.chats;
            const folders = state.folders;
            const folderedChatIds = folders.flatMap(
                (folder) => folder.chatIds || []
            );
            const unfolderedChats = chats
                .map((chat) => chat.id)
                .filter((id) => !folderedChatIds.includes(id));
            return { unfolderedChats };
        }),

    unfolderedChats: [],
});
