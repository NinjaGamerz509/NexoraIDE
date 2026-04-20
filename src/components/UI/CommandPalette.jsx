'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useIDEStore from '@/store/ideStore';
import { useFileSystem } from '@/hooks/useFileSystem';

export default function CommandPalette() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef();
  const {
    toggleCommandPalette, openTabs, setActiveTab, toggleSidebar,
    toggleZenMode, openSettings, togglePreview, addToast,
    toggleSplitEditor,
  } = useIDEStore();
  const { openFolder } = useFileSystem();

  const COMMANDS = [
    { label: 'Open Folder', icon: 'folder_open', action: openFolder, shortcut: 'Ctrl+O' },
    { label: 'Toggle Sidebar', icon: 'view_sidebar', action: toggleSidebar, shortcut: 'Ctrl+B' },
    { label: 'Toggle Zen Mode', icon: 'fullscreen', action: toggleZenMode, shortcut: 'F11' },
    { label: 'Toggle Preview', icon: 'preview', action: togglePreview, shortcut: 'Ctrl+Shift+V' },
    { label: 'Split Editor', icon: 'view_column', action: toggleSplitEditor, shortcut: 'Ctrl+\\' },
    { label: 'Settings: Appearance', icon: 'palette', action: () => openSettings('appearance') },
    { label: 'Settings: Editor', icon: 'edit', action: () => openSettings('editor') },
    { label: 'Settings: Shortcuts', icon: 'keyboard', action: () => openSettings('shortcuts') },
    { label: 'Settings: Emmets', icon: 'code', action: () => openSettings('emmets') },
    ...openTabs.map((tab) => ({
      label: `Open: ${tab.name}`,
      icon: 'description',
      action: () => setActiveTab(tab.path),
    })),
  ];

  const filtered = query
    ? COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : COMMANDS;

  useEffect(() => {
    setSelected(0);
    inputRef.current?.focus();
  }, [query]);

  const execute = (cmd) => {
    cmd.action?.();
    toggleCommandPalette();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') toggleCommandPalette();
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected]);
  };

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center pt-[20vh]"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={toggleCommandPalette}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg mx-4 rounded-xl overflow-hidden"
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="material-icons mr-2" style={{ fontSize: 18, color: 'var(--text-muted)' }}>search</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands..."
            className="flex-1 text-sm outline-none bg-transparent"
            style={{ color: 'var(--text)' }}
          />
          <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Esc</kbd>
        </div>
        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No commands found</div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={i}
                onClick={() => execute(cmd)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left"
                style={{
                  background: selected === i ? 'var(--active)' : 'transparent',
                  color: 'var(--text)',
                }}
                onMouseEnter={() => setSelected(i)}
              >
                <span className="material-icons flex-shrink-0" style={{ fontSize: 16, color: 'var(--text-muted)' }}>{cmd.icon}</span>
                <span className="flex-1">{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--hover)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    {cmd.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
