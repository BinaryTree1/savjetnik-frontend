// src/store/viewStore.js
export const createViewSlice = (set) => ({
    isFolderView: false,
    toggleFolderView: () =>
        set((state) => ({
            isFolderView: !state.isFolderView,
        })),
});
