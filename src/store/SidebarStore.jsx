// src/store/sidebarStore.js
export const createSidebarSlice = (set) => ({
    isSidebarOpen: true,
    toggleSidebar: () =>
        set((state) => ({
            isSidebarOpen: !state.isSidebarOpen,
        })),
});
