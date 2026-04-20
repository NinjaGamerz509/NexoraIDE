'use client';
import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIDEStore from '@/store/ideStore';
import MonacoEditor from './MonacoEditor';
import LivePreview from '../Preview/LivePreview';

export default function EditorArea() {
  const {
    openTabs, activeTab, setActiveTab, closeAndSave, pinTab,
    splitEditor, secondActiveTab, setSecondActiveTab,
    previewVisible, togglePreview,
    fileContents,
  } = useIDEStore();

  // Resizable preview
  const [previewWidth, setPreviewWidth] = useState(400);
  const isResizing = useRef(false);

  const startPreviewResize = useCallback((e) => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    const startX = e.clientX;
    const startW = previewWidth;
    const onMove = (e) => {
      if (!isResizing.current) return;
      const diff = startX - e.clientX;
      setPreviewWidth(Math.max(200, Math.min(800, startW + diff)));
    };
    const onUp = () => {
      isResizing.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [previewWidth]);

  const activeFile = openTabs.find((t) => t.path === activeTab);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div
        className="flex items-center overflow-x-auto flex-shrink-0"
        style={{
          background: 'var(--tab)',
          borderBottom: '1px solid var(--border)',
          height: 35,
          scrollbarWidth: 'none',
        }}
      >
        {openTabs.length === 0 ? (
          <div className="flex items-center px-4 h-full">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Open a file to start editing
            </span>
          </div>
        ) : (
          openTabs.map((tab) => (
            <Tab
              key={tab.path}
              tab={tab}
              active={activeTab === tab.path}
              onSelect={() => setActiveTab(tab.path)}
              onClose={() => closeAndSave(tab.path)}
              onPin={() => pinTab(tab.path)}
            />
          ))
        )}
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor(s) */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {activeFile ? (
            splitEditor ? (
              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <MonacoEditor file={activeFile} />
                </div>
                <div className="w-1 flex-shrink-0" style={{ background: 'var(--border)', cursor: 'col-resize' }} />
                <div className="flex-1 overflow-hidden">
                  {secondActiveTab ? (
                    <MonacoEditor file={openTabs.find((t) => t.path === secondActiveTab) || activeFile} />
                  ) : (
                    <MonacoEditor file={activeFile} />
                  )}
                </div>
              </div>
            ) : (
              <MonacoEditor file={activeFile} />
            )
          ) : (
            <WelcomeScreen />
          )}
        </div>

        {/* Preview resize handle */}
        {previewVisible && (
          <div
            className="w-1 flex-shrink-0 cursor-col-resize"
            style={{ background: 'var(--border)' }}
            onMouseDown={startPreviewResize}
            onMouseEnter={(e) => (e.target.style.background = 'var(--accent)')}
            onMouseLeave={(e) => (e.target.style.background = 'var(--border)')}
          />
        )}

        {/* Live Preview */}
        <AnimatePresence>
          {previewVisible && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: previewWidth, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 overflow-hidden"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              <LivePreview width={previewWidth} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Tab({ tab, active, onSelect, onClose, onPin }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-1 px-3 h-full flex-shrink-0 cursor-pointer group border-r select-none"
      style={{
        background: active ? 'var(--tab-active)' : 'transparent',
        borderColor: 'var(--border)',
        borderTop: active ? '1px solid var(--accent)' : '1px solid transparent',
        minWidth: 80,
        maxWidth: 180,
        position: 'relative',
      }}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tab.pinned && (
        <span className="material-icons" style={{ fontSize: 10, color: 'var(--accent)' }}>push_pin</span>
      )}
      <span className="text-xs truncate flex-1" style={{ color: active ? 'var(--text)' : 'var(--text-muted)' }}>
        {tab.name}
      </span>
      {(hovered || active) && (
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="flex items-center justify-center w-4 h-4 rounded"
          style={{ color: 'var(--text-muted)', flexShrink: 0 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--active)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <span className="material-icons" style={{ fontSize: 12 }}>close</span>
        </button>
      )}
    </div>
  );
}

function WelcomeScreen() {
  const { openSettings } = useIDEStore();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Welcome to My IDE</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Open a folder to start coding
        </p>
        <div className="flex flex-col gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>Ctrl+O</kbd> Open Folder</div>
          <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>Ctrl+Shift+P</kbd> Command Palette</div>
          <div className="flex items-center gap-2"><kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}>F11</kbd> Zen Mode</div>
        </div>
      </motion.div>
    </div>
  );
}
