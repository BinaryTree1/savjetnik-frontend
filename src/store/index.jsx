// store.js
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
  toggleFolderView: () =>
    set((state) => ({
      isFolderView: !state.isFolderView,
    })),

  // Chats State
  chats: [{ id: 1, title: '', messages: [] }],
  selectedChatId: 1,

  addChat: () => {
    const chats = get().chats;
    const emptyChatIndex = chats.findIndex(
      (chat) => chat.messages.length === 0
    );
    if (emptyChatIndex !== -1) {
      const emptyChat = chats[emptyChatIndex];
      const updatedChats = [
        emptyChat,
        ...chats.filter((_, idx) => idx !== emptyChatIndex),
      ];
      set({ chats: updatedChats, selectedChatId: emptyChat.id });
    } else {
      const newChatId =
        chats.length > 0 ? Math.max(...chats.map((chat) => chat.id)) + 1 : 1;
      const newChat = { id: newChatId, title: '', messages: [] };
      set((state) => ({
        chats: [newChat, ...state.chats],
        selectedChatId: newChatId,
      }));
    }
  },

  editChat: (chatId, newTitle) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ),
    })),

  deleteChat: (chatId) =>
    set((state) => {
      const updatedChats = state.chats.filter((chat) => chat.id !== chatId);
      const selectedChatId =
        state.selectedChatId === chatId
          ? updatedChats[0]?.id || null
          : state.selectedChatId;
      return { chats: updatedChats, selectedChatId };
    }),

  selectChat: (chatId) => set({ selectedChatId: chatId }),

  sendMessage: (messageText) => {
    const selectedChatId = get().selectedChatId;
    if (!selectedChatId) return;
    set((state) => {
      const chats = state.chats.map((chat) => {
        if (chat.id === selectedChatId) {
          const isFirstMessage = chat.messages.length === 0;
          const updatedMessages = [
            ...chat.messages,
            { text: messageText, sender: 'user' },
          ];
          const updatedTitle = isFirstMessage
            ? messageText.split(' ').slice(0, 3).join(' ')
            : chat.title;
          return { ...chat, messages: updatedMessages, title: updatedTitle };
        }
        return chat;
      });
      return { chats };
    });

    // Simulate bot response
    setTimeout(() => {
      set((state) => {
        const chats = state.chats.map((chat) => {
          if (chat.id === selectedChatId) {
            const updatedMessages = [
              ...chat.messages,
              { text: 'This is a bot response.', sender: 'bot' },
            ];
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        });
        return { chats };
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
    const folderedChatIds = folders.flatMap((folder) => folder.chatIds);
    const unfolderedChats = chats
      .map((chat) => chat.id)
      .filter((id) => !folderedChatIds.includes(id));
    set({ unfolderedChats });
  },
}));

export default useStore;
