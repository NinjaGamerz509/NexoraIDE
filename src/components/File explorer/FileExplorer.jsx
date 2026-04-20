'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIDEStore from '@/store/ideStore';
import { useFileSystem } from '@/hooks/useFileSystem';
import FileItem from './FileItem';
import ContextMenu from '../UI/ContextMenu';

export default function FileExplorer() {
  const { folderName, fileTree, folderHandle, addToast } = useIDEStore();
  const { openFolder, createFile, createFolder, refreshTree } = useFileSystem();
  const [newItemMode, setNewItemMode] = useState(null); // 'file' | 'folder'
  const [newItemName, setNewItemName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const inputRef = useRef();

  const handleOpenFolder = async () => {
    await openFolder();
  };

  const startNewItem = (type) => {
    setNewItemMode(type);
    setNewItemName('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const confirmNewItem = async () => {
    if (!newItemName.trim() || !folderHandle) return;
    if (newItemMode === 'file') {
      await createFile(folderHandle, newItemName.trim());
    } else {
      await createFolder(folderHandle, newItemName.trim());
    }
    await refreshTree();
    setNewItemMode(null);
    setNewItemName('');
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--sidebar)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Explorer
        </span>
        {folderHandle && (
          <button
            onClick={handleOpenFolder}
            title="Open different folder"
            className="flex items-center justify-center w-5 h-5 rounded"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <span className="material-icons" style={{ fontSize: 14 }}>folder_open</span>
          </button>
        )}
      </div>

      {!folderHandle ? (
        /* No folder open */
        <div className="flex flex-col items-center justify-center flex-1 p-4 gap-3">
          <span className="material-icons text-4xl" style={{ color: 'var(--text-muted)' }}>folder_open</span>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            No folder open
          </p>
          <button
            onClick={handleOpenFolder}
            className="px-3 py-1.5 rounded text-xs font-medium transition-all"
            style={{
              background: 'var(--accent)',
              color: '#fff',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Open Folder
          </button>
        </div>
      ) : (
        <>
          {/* Folder name */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="material-icons text-sm folder-icon" style={{ fontSize: 14 }}>folder</span>
            <span className="text-xs font-semibold uppercase tracking-wider truncate" style={{ color: 'var(--text)' }}>
              {folderName}
            </span>
          </div>

          {/* File tree */}
          <div className="flex-1 overflow-y-auto py-1">
            {/* New item input */}
            <AnimatePresence>
              {newItemMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <span className="material-icons text-xs" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    {newItemMode === 'file' ? 'description' : 'folder'}
                  </span>
                  <input
                    ref={inputRef}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmNewItem();
                      if (e.key === 'Escape') setNewItemMode(null);
                    }}
                    onBlur={() => {
                      if (newItemName.trim()) confirmNewItem();
                      else setNewItemMode(null);
                    }}
                    className="flex-1 text-xs px-1 py-0.5 rounded outline-none"
                    style={{
                      background: 'var(--bg)',
                      color: 'var(--text)',
                      border: '1px solid var(--accent)',
                    }}
                    placeholder={newItemMode === 'file' ? 'filename.js' : 'folder-name'}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {fileTree.map((item) => (
              <FileItem key={item.path} item={item} depth={0} />
            ))}
          </div>

          {/* Bottom actions */}
          <div
            className="flex items-center justify-between px-2 py-1.5 flex-shrink-0"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <button
              onClick={() => startNewItem('file')}
              title="New File"
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="material-icons" style={{ fontSize: 14 }}>add</span>
              File
            </button>
            <button
              onClick={() => startNewItem('folder')}
              title="New Folder"
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="material-icons" style={{ fontSize: 14 }}>create_new_folder</span>
              Folder
            </button>
            <button
              onClick={refreshTree}
              title="Refresh"
              className="flex items-center justify-center w-7 h-7 rounded transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="material-icons" style={{ fontSize: 14 }}>refresh</span>
            </button>
          </div>
        </>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
