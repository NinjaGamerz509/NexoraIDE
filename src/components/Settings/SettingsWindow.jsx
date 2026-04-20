'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIDEStore from '@/store/ideStore';
import { EMMET_MAP, HTML_EMMETS, CSS_EMMETS, JS_SNIPPETS, REACT_SNIPPETS, NEXTJS_SNIPPETS, NODE_SNIPPETS } from '@/lib/emmet';

const TABS = [
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'editor', label: 'Editor', icon: 'edit' },
  { id: 'shortcuts', label: 'Shortcuts', icon: 'keyboard' },
  { id: 'emmets', label: 'Emmets & Snippets', icon: 'code' },
];

const THEMES = [
  { id: 'dark', label: 'Dark', icon: 'dark_mode' },
  { id: 'light', label: 'Light', icon: 'light_mode' },
  { id: 'aqua', label: 'Aqua', icon: 'water' },
  { id: 'system', label: 'System', icon: 'computer' },
];

const GOOGLE_FONTS_MONO = [
  'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'Roboto Mono',
  'Ubuntu Mono', 'Inconsolata', 'Space Mono', 'Courier Prime',
];

export default function SettingsWindow() {
  const {
    closeSettings, settingsTab, theme, setTheme,
    fontSize, fontFamily, tabSize, wordWrap, autoSave,
    minimap, lineNumbers, indentGuides, bracketPairColorization,
    smoothScrolling, formatOnSave, stickyScroll, setEditorSetting,
    shortcuts, updateShortcut, resetShortcuts,
  } = useIDEStore();

  const [activeTab, setActiveTab] = useState(settingsTab);
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleShortcutEdit = (action) => {
    setEditingShortcut(action);
  };

  const handleShortcutKeyDown = (e, action) => {
    e.preventDefault();
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    const key = e.key === ' ' ? 'Space' : e.key;
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) parts.push(key);
    if (parts.length > 0) {
      updateShortcut(action, parts.join('+'));
      setEditingShortcut(null);
    }
  };

  const SHORTCUT_LABELS = {
    newFile: 'New File',
    newFolder: 'New Folder',
    openFolder: 'Open Folder',
    save: 'Save',
    saveAs: 'Save As',
    closeTab: 'Close Tab',
    reopenTab: 'Reopen Closed Tab',
    nextTab: 'Next Tab',
    prevTab: 'Previous Tab',
    find: 'Find in File',
    replace: 'Find & Replace',
    searchAll: 'Search in All Files',
    quickOpen: 'Quick Open',
    commandPalette: 'Command Palette',
    goToLine: 'Go to Line',
    toggleComment: 'Toggle Comment',
    formatDocument: 'Format Document',
    toggleSidebar: 'Toggle Sidebar',
    splitEditor: 'Split Editor',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset Zoom',
    zenMode: 'Zen Mode',
    togglePreview: 'Toggle Preview',
    openBrowser: 'Open in Browser',
    deleteLine: 'Delete Line',
    moveLineUp: 'Move Line Up',
    moveLineDown: 'Move Line Down',
    selectLine: 'Select Line',
    selectNextOccurrence: 'Select Next Occurrence',
  };

  const ALL_EMMETS = [
    { category: 'HTML', items: HTML_EMMETS },
    { category: 'CSS', items: CSS_EMMETS },
    { category: 'JavaScript', items: JS_SNIPPETS },
    { category: 'React', items: REACT_SNIPPETS },
    { category: 'Next.js', items: NEXTJS_SNIPPETS },
    { category: 'Node.js', items: NODE_SNIPPETS },
  ];

  const filteredShortcuts = Object.entries(shortcuts).filter(([action]) =>
    !searchQuery || (SHORTCUT_LABELS[action] || action).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={closeSettings}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="flex overflow-hidden rounded-xl"
        style={{
          width: '80vw',
          maxWidth: 900,
          height: '70vh',
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="flex flex-col py-4" style={{ width: 200, borderRight: '1px solid var(--border)', background: 'var(--sidebar)' }}>
          <div className="px-4 mb-4">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Settings</h2>
          </div>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 text-sm transition-colors text-left"
              style={{
                color: activeTab === tab.id ? 'var(--text)' : 'var(--text-muted)',
                background: activeTab === tab.id ? 'var(--active)' : 'transparent',
                borderLeft: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              <span className="material-icons" style={{ fontSize: 16 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all text-sm"
                      style={{
                        background: theme === t.id ? 'var(--active)' : 'var(--hover)',
                        border: theme === t.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                        color: 'var(--text)',
                      }}
                    >
                      <span className="material-icons" style={{ fontSize: 18, color: theme === t.id ? 'var(--accent)' : 'var(--text-muted)' }}>{t.icon}</span>
                      {t.label}
                      {theme === t.id && <span className="material-icons ml-auto" style={{ fontSize: 14, color: 'var(--accent)' }}>check</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Font Family</h3>
                <div className="grid grid-cols-2 gap-2">
                  {GOOGLE_FONTS_MONO.map((font) => (
                    <button
                      key={font}
                      onClick={() => setEditorSetting('fontFamily', font)}
                      className="p-2 rounded text-xs transition-all text-left"
                      style={{
                        background: fontFamily === font ? 'var(--active)' : 'var(--hover)',
                        border: fontFamily === font ? '1px solid var(--accent)' : '1px solid var(--border)',
                        color: 'var(--text)',
                        fontFamily: font,
                      }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Editor */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Editor Settings</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Font Size: {fontSize}px</label>
                  <input
                    type="range" min="10" max="28" value={fontSize}
                    onChange={(e) => setEditorSetting('fontSize', Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Tab Size: {tabSize}</label>
                  <div className="flex gap-2">
                    {[2, 4].map((s) => (
                      <button key={s} onClick={() => setEditorSetting('tabSize', s)}
                        className="px-3 py-1 rounded text-xs"
                        style={{
                          background: tabSize === s ? 'var(--accent)' : 'var(--hover)',
                          color: tabSize === s ? '#fff' : 'var(--text)',
                          border: '1px solid var(--border)',
                        }}
                      >{s} spaces</button>
                    ))}
                  </div>
                </div>
              </div>

              {[
                { key: 'wordWrap', label: 'Word Wrap' },
                { key: 'autoSave', label: 'Auto Save' },
                { key: 'minimap', label: 'Minimap' },
                { key: 'lineNumbers', label: 'Line Numbers' },
                { key: 'indentGuides', label: 'Indent Guides' },
                { key: 'bracketPairColorization', label: 'Bracket Pair Colorization' },
                { key: 'smoothScrolling', label: 'Smooth Scrolling' },
                { key: 'formatOnSave', label: 'Format on Save' },
                { key: 'stickyScroll', label: 'Sticky Scroll' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{label}</span>
                  <button
                    onClick={() => setEditorSetting(key, !useIDEStore.getState()[key])}
                    className="relative w-10 h-5 rounded-full transition-colors"
                    style={{ background: useIDEStore.getState()[key] ? 'var(--accent)' : 'var(--active)' }}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                      style={{ transform: useIDEStore.getState()[key] ? 'translateX(20px)' : 'translateX(2px)' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Shortcuts */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Keyboard Shortcuts</h3>
                <button
                  onClick={resetShortcuts}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: 'var(--hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  Reset All
                </button>
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className="w-full text-xs px-3 py-1.5 rounded outline-none mb-3"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
              />
              {filteredShortcuts.map(([action, keys]) => (
                <div key={action} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{SHORTCUT_LABELS[action] || action}</span>
                  {editingShortcut === action ? (
                    <input
                      autoFocus
                      readOnly
                      placeholder="Press keys..."
                      onKeyDown={(e) => handleShortcutKeyDown(e, action)}
                      onBlur={() => setEditingShortcut(null)}
                      className="text-xs px-2 py-1 rounded outline-none w-36 text-center"
                      style={{ background: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                    />
                  ) : (
                    <button
                      onClick={() => handleShortcutEdit(action)}
                      className="text-xs px-2 py-1 rounded font-mono"
                      style={{ background: 'var(--hover)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      {keys}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Emmets */}
          {activeTab === 'emmets' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Emmets & Snippets</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                These are read-only. Triggers expand automatically in the editor based on file type.
              </p>
              {ALL_EMMETS.map(({ category, items }) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>{category}</h4>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div key={item.trigger} className="flex items-start gap-3 py-1.5 px-2 rounded" style={{ background: 'var(--hover)' }}>
                        <code className="text-xs font-mono flex-shrink-0" style={{ color: 'var(--accent)', minWidth: 80 }}>{item.trigger}</code>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.description}</span>
                        <span className="text-xs ml-auto flex-shrink-0 px-1.5 py-0.5 rounded" style={{ background: 'var(--active)', color: 'var(--text-muted)' }}>{item.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close btn */}
        <button
          onClick={closeSettings}
          className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full"
          style={{ background: 'var(--hover)', color: 'var(--text-muted)' }}
        >
          <span className="material-icons" style={{ fontSize: 16 }}>close</span>
        </button>
      </motion.div>
    </div>
  );
}
