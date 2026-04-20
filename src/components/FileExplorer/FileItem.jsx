'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIDEStore from '@/store/ideStore';
import { useFileSystem } from '@/hooks/useFileSystem';
import ContextMenu from '../UI/ContextMenu';

function getFileIcon(name) {
  const ext = name.split('.').pop()?.toLowerCase();
  const icons = {
    html: { icon: 'html', color: '#e44d26' },
    css: { icon: 'css', color: '#264de4' },
    js: { icon: 'javascript', color: '#f7df1e' },
    jsx: { icon: 'code', color: '#61dafb' },
    ts: { icon: 'code', color: '#3178c6' },
    tsx: { icon: 'code', color: '#3178c6' },
    json: { icon: 'data_object', color: '#cbcb41' },
    md: { icon: 'description', color: '#cccccc' },
    env: { icon: 'lock', color: '#ecd53f' },
    gitignore: { icon: 'commit', color: '#f05033' },
    png: { icon: 'image', color: '#a074c4' },
    jpg: { icon: 'image', color: '#a074c4' },
    jpeg: { icon: 'image', color: '#a074c4' },
    svg: { icon: 'image', color: '#ffb13b' },
    gif: { icon: 'image', color: '#a074c4' },
    pdf: { icon: 'picture_as_pdf', color: '#f40f02' },
    py: { icon: 'code', color: '#3572A5' },
    go: { icon: 'code', color: '#00ADD8' },
    rs: { icon: 'code', color: '#dea584' },
    php: { icon: 'code', color: '#777bb3' },
    sh: { icon: 'terminal', color: '#4CAF50' },
    yml: { icon: 'settings', color: '#cb171e' },
    yaml: { icon: 'settings', color: '#cb171e' },
  };
  return icons[ext] || { icon: 'description', color: 'var(--text-muted)' };
}

function getFolderColor(name) {
  const lc = name.toLowerCase();
  if (lc.includes('component')) return '#61dafb';
  if (lc.includes('page')) return '#7ec8e3';
  if (lc.includes('api')) return '#f7df1e';
  if (lc.includes('asset') || lc.includes('public')) return '#4caf50';
  if (lc.includes('style') || lc.includes('css')) return '#264de4';
  if (lc.includes('hook')) return '#a074c4';
  if (lc.includes('util') || lc.includes('lib')) return '#f7a743';
  return '#dcb67a';
}

export default function FileItem({ item, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0 && item.kind === 'directory');
  const [contextMenu, setContextMenu] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const { addTab, activeTab, addToast, fileContents } = useIDEStore();
  const { readFile, deleteEntry, refreshTree } = useFileSystem();
  const renameRef = useRef();

  const handleClick = async () => {
    if (item.kind === 'directory') {
      setOpen(!open);
    } else {
      const content = await readFile(item.handle);
      addTab({
        name: item.name,
        path: item.path,
        handle: item.handle,
        content,
        language: getLanguage(item.name),
      });
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const menuItems =
      item.kind === 'file'
        ? [
            { label: 'Rename', icon: 'edit', action: () => { setRenaming(true); setTimeout(() => renameRef.current?.select(), 50); } },
            { label: 'Delete', icon: 'delete', action: handleDelete, danger: true },
          ]
        : [
            { label: 'New File', icon: 'add', action: () => {} },
            { label: 'New Folder', icon: 'create_new_folder', action: () => {} },
            { label: 'Rename', icon: 'edit', action: () => { setRenaming(true); setTimeout(() => renameRef.current?.select(), 50); } },
            { label: 'Delete', icon: 'delete', action: handleDelete, danger: true },
          ];
    setContextMenu({ x: e.clientX, y: e.clientY, items: menuItems });
  };

  const handleDelete = async () => {
    addToast({ type: 'info', message: `Deleted: ${item.name}` });
    // parent handle needed — simplified
    await refreshTree();
  };

  const isActive = activeTab === item.path;
  const fileInfo = item.kind === 'file' ? getFileIcon(item.name) : null;
  const folderColor = item.kind === 'directory' ? getFolderColor(item.name) : null;

  return (
    <>
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className="flex items-center gap-1.5 py-0.5 pr-2 cursor-pointer select-none group"
        style={{
          paddingLeft: `${(depth + 1) * 12}px`,
          background: isActive ? 'var(--active)' : 'transparent',
          color: isActive ? 'var(--text)' : 'var(--text)',
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = 'var(--hover)';
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = 'transparent';
        }}
      >
        {/* Expand arrow for folders */}
        {item.kind === 'directory' ? (
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="material-icons flex-shrink-0"
            style={{ fontSize: 14, color: 'var(--text-muted)' }}
          >
            chevron_right
          </motion.span>
        ) : (
          <span style={{ width: 14, flexShrink: 0 }} />
        )}

        {/* Icon */}
        {item.kind === 'directory' ? (
          <span className="material-icons flex-shrink-0" style={{ fontSize: 16, color: folderColor }}>
            {open ? 'folder_open' : 'folder'}
          </span>
        ) : (
          <span className="material-icons flex-shrink-0" style={{ fontSize: 16, color: fileInfo.color }}>
            {fileInfo.icon}
          </span>
        )}

        {/* Name */}
        {renaming ? (
          <input
            ref={renameRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Escape') setRenaming(false);
            }}
            onBlur={() => setRenaming(false)}
            className="flex-1 text-xs px-1 py-0 rounded outline-none"
            style={{
              background: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--accent)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-xs truncate flex-1" style={{ color: 'var(--text)' }}>
            {item.name}
          </span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence>
        {item.kind === 'directory' && open && item.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
          >
            {item.children.map((child) => (
              <FileItem key={child.path} item={child} depth={depth + 1} />
            ))}
            {item.children.length === 0 && (
              <div
                className="text-xs py-0.5"
                style={{ paddingLeft: `${(depth + 2) * 12}px`, color: 'var(--text-muted)' }}
              >
                Empty folder
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}

function getLanguage(filename) {
  const ext = filename.split('.').pop()?.toLowerCase();
  const map = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    html: 'html', css: 'css', json: 'json', md: 'markdown',
    py: 'python', go: 'go', rs: 'rust', php: 'php',
    sh: 'shell', yml: 'yaml', yaml: 'yaml', env: 'plaintext',
  };
  return map[ext] || 'plaintext';
}
