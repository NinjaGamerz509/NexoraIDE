'use client';
import { useEffect, useCallback } from 'react';
import useIDEStore from '@/store/ideStore';

function matchesShortcut(e, shortcut) {
  if (!shortcut) return false;
  const parts = shortcut.split('+');
  const key = parts[parts.length - 1];
  const ctrl = parts.includes('Ctrl');
  const shift = parts.includes('Shift');
  const alt = parts.includes('Alt');
  const meta = parts.includes('Meta');

  return (
    (e.ctrlKey === ctrl || e.metaKey === (meta || ctrl)) &&
    e.shiftKey === shift &&
    e.altKey === alt &&
    (e.key === key || e.code === `Key${key}` || e.key.toUpperCase() === key.toUpperCase())
  );
}

export function useKeyboardShortcuts() {
  const store = useIDEStore();

  const handleKeyDown = useCallback(
    (e) => {
      const { shortcuts } = store;

      if (matchesShortcut(e, shortcuts.commandPalette)) {
        e.preventDefault();
        store.toggleCommandPalette();
        return;
      }
      if (matchesShortcut(e, shortcuts.toggleSidebar)) {
        e.preventDefault();
        store.toggleSidebar();
        return;
      }
      if (matchesShortcut(e, shortcuts.zenMode)) {
        e.preventDefault();
        store.toggleZenMode();
        return;
      }
      if (matchesShortcut(e, shortcuts.newFile)) {
        e.preventDefault();
        store.addToast({ type: 'info', message: 'New file shortcut — use the + button' });
        return;
      }
      if (matchesShortcut(e, shortcuts.closeTab)) {
        e.preventDefault();
        if (store.activeTab) store.closeAndSave(store.activeTab);
        return;
      }
      if (matchesShortcut(e, shortcuts.reopenTab)) {
        e.preventDefault();
        store.reopenLastTab();
        return;
      }
      if (matchesShortcut(e, shortcuts.splitEditor)) {
        e.preventDefault();
        store.toggleSplitEditor();
        return;
      }
      if (matchesShortcut(e, shortcuts.togglePreview)) {
        e.preventDefault();
        store.togglePreview();
        return;
      }
      // Zoom with Ctrl + Scroll is handled in editor component
      if (matchesShortcut(e, shortcuts.resetZoom)) {
        e.preventDefault();
        store.setEditorZoom(100);
        return;
      }
    },
    [store]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
