import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_SHORTCUTS = {
  newFile: 'Ctrl+N',
  newFolder: 'Ctrl+Shift+N',
  openFolder: 'Ctrl+O',
  save: 'Ctrl+S',
  saveAs: 'Ctrl+Shift+S',
  closeTab: 'Ctrl+W',
  reopenTab: 'Ctrl+Shift+T',
  nextTab: 'Ctrl+Tab',
  prevTab: 'Ctrl+Shift+Tab',
  find: 'Ctrl+F',
  replace: 'Ctrl+H',
  searchAll: 'Ctrl+Shift+F',
  quickOpen: 'Ctrl+P',
  commandPalette: 'Ctrl+Shift+P',
  goToLine: 'Ctrl+G',
  toggleComment: 'Ctrl+/',
  formatDocument: 'Shift+Alt+F',
  toggleSidebar: 'Ctrl+B',
  splitEditor: 'Ctrl+\\',
  zoomIn: 'Ctrl+=',
  zoomOut: 'Ctrl+-',
  resetZoom: 'Ctrl+0',
  zenMode: 'F11',
  togglePreview: 'Ctrl+Shift+V',
  openBrowser: 'Ctrl+Shift+B',
  deleteLine: 'Ctrl+Shift+K',
  moveLineUp: 'Alt+ArrowUp',
  moveLineDown: 'Alt+ArrowDown',
  selectLine: 'Ctrl+L',
  selectNextOccurrence: 'Ctrl+D',
};

const useIDEStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      workspaceTheme: 'system',
      setTheme: (theme) => set({ theme }),
      setWorkspaceTheme: (t) => set({ workspaceTheme: t }),

      // Editor settings
      fontSize: 14,
      fontFamily: 'JetBrains Mono',
      tabSize: 2,
      wordWrap: true,
      autoSave: true,
      minimap: true,
      lineNumbers: true,
      indentGuides: true,
      bracketPairColorization: true,
      smoothScrolling: true,
      formatOnSave: true,
      stickyScroll: true,
      setEditorSetting: (key, value) => set({ [key]: value }),

      // Zoom
      editorZoom: 100,
      setEditorZoom: (zoom) => set({ editorZoom: Math.min(200, Math.max(50, zoom)) }),

      // Tabs
      openTabs: [],
      activeTab: null,
      addTab: (file) => {
        const { openTabs } = get();
        const exists = openTabs.find((t) => t.path === file.path);
        if (!exists) {
          set({ openTabs: [...openTabs, file], activeTab: file.path });
        } else {
          set({ activeTab: file.path });
        }
      },
      removeTab: (path) => {
        const { openTabs, activeTab } = get();
        const newTabs = openTabs.filter((t) => t.path !== path);
        let newActive = activeTab;
        if (activeTab === path) {
          const idx = openTabs.findIndex((t) => t.path === path);
          newActive = newTabs[idx]?.path || newTabs[idx - 1]?.path || null;
        }
        set({ openTabs: newTabs, activeTab: newActive });
      },
      setActiveTab: (path) => set({ activeTab: path }),
      pinTab: (path) => {
        const { openTabs } = get();
        set({
          openTabs: openTabs.map((t) =>
            t.path === path ? { ...t, pinned: !t.pinned } : t
          ),
        });
      },
      recentlyClosed: [],
      closeAndSave: (path) => {
        const { openTabs, recentlyClosed } = get();
        const tab = openTabs.find((t) => t.path === path);
        if (tab) {
          set({ recentlyClosed: [tab, ...recentlyClosed.slice(0, 9)] });
        }
        get().removeTab(path);
      },
      reopenLastTab: () => {
        const { recentlyClosed } = get();
        if (recentlyClosed.length > 0) {
          const [tab, ...rest] = recentlyClosed;
          get().addTab(tab);
          set({ recentlyClosed: rest });
        }
      },

      // File contents cache
      fileContents: {},
      setFileContent: (path, content) => {
        set({ fileContents: { ...get().fileContents, [path]: content } });
      },

      // File System Handle
      folderHandle: null,
      folderName: null,
      setFolderHandle: (handle, name) => set({ folderHandle: handle, folderName: name }),

      // File tree
      fileTree: [],
      setFileTree: (tree) => set({ fileTree: tree }),

      // Active panel
      activePanel: 'explorer',
      setActivePanel: (panel) => set({ activePanel: panel }),

      // Sidebar visible
      sidebarVisible: true,
      toggleSidebar: () => set({ sidebarVisible: !get().sidebarVisible }),

      // Preview
      previewVisible: false,
      previewUrl: '',
      togglePreview: () => set({ previewVisible: !get().previewVisible }),
      setPreviewUrl: (url) => set({ previewUrl: url }),

      // Zen mode
      zenMode: false,
      toggleZenMode: () => set({ zenMode: !get().zenMode }),

      // Split editor
      splitEditor: false,
      toggleSplitEditor: () => set({ splitEditor: !get().splitEditor }),
      secondActiveTab: null,
      setSecondActiveTab: (path) => set({ secondActiveTab: path }),

      // Keyboard shortcuts
      shortcuts: DEFAULT_SHORTCUTS,
      updateShortcut: (action, keys) => {
        set({ shortcuts: { ...get().shortcuts, [action]: keys } });
      },
      resetShortcuts: () => set({ shortcuts: DEFAULT_SHORTCUTS }),

      // Command palette
      commandPaletteOpen: false,
      toggleCommandPalette: () => set({ commandPaletteOpen: !get().commandPaletteOpen }),

      // Notifications/toasts
      toasts: [],
      addToast: (toast) => {
        const id = Date.now();
        set({ toasts: [...get().toasts, { ...toast, id }] });
        setTimeout(() => {
          set({ toasts: get().toasts.filter((t) => t.id !== id) });
        }, toast.duration || 3000);
      },
      removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

      // Settings window
      settingsOpen: false,
      settingsTab: 'appearance',
      openSettings: (tab = 'appearance') => set({ settingsOpen: true, settingsTab: tab }),
      closeSettings: () => set({ settingsOpen: false }),

      // User
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'ide-store',
      partialize: (state) => ({
        theme: state.theme,
        workspaceTheme: state.workspaceTheme,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        tabSize: state.tabSize,
        wordWrap: state.wordWrap,
        autoSave: state.autoSave,
        minimap: state.minimap,
        lineNumbers: state.lineNumbers,
        indentGuides: state.indentGuides,
        bracketPairColorization: state.bracketPairColorization,
        smoothScrolling: state.smoothScrolling,
        formatOnSave: state.formatOnSave,
        stickyScroll: state.stickyScroll,
        editorZoom: state.editorZoom,
        shortcuts: state.shortcuts,
        sidebarVisible: state.sidebarVisible,
      }),
    }
  )
);

export default useIDEStore;
