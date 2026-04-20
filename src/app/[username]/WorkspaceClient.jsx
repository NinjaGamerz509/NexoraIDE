'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { SessionProvider } from 'next-auth/react';
import useIDEStore from '@/store/ideStore';
import { useTheme } from '@/hooks/useTheme';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import ActivityBar from '@/components/ActivityBar/ActivityBar';
import FileExplorer from '@/components/FileExplorer/FileExplorer';
import EditorArea from '@/components/Editor/EditorArea';
import StatusBar from '@/components/StatusBar/StatusBar';
import ToastContainer from '@/components/UI/ToastContainer';
import SettingsWindow from '@/components/Settings/SettingsWindow';
import CommandPalette from '@/components/UI/CommandPalette';
import TopBar from '@/components/UI/TopBar';

function IDELayout({ session, username }) {
  useTheme();
  useKeyboardShortcuts();

  const {
    sidebarVisible,
    activePanel,
    zenMode,
    settingsOpen,
    commandPaletteOpen,
    setUser,
  } = useIDEStore();

  // Resizable sidebar
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const isResizing = useRef(false);

  useEffect(() => {
    if (session?.user) setUser(session.user);
  }, [session, setUser]);

  const startResize = useCallback((e) => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (e) => {
      if (!isResizing.current) return;
      const newW = e.clientX - 48; // subtract activity bar width
      setSidebarWidth(Math.max(150, Math.min(500, newW)));
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
  }, []);

  return (
    <div
      className={`ide-layout flex flex-col ${zenMode ? 'zen-mode' : ''}`}
      style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg)' }}
    >
      {/* Top Bar */}
      <TopBar username={username} session={session} />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        {!zenMode && <ActivityBar />}

        {/* Sidebar / File Explorer */}
        {!zenMode && sidebarVisible && (
          <>
            <div
              className="file-explorer flex-shrink-0 overflow-hidden flex flex-col"
              style={{
                width: sidebarWidth,
                background: 'var(--sidebar)',
                borderRight: '1px solid var(--border)',
              }}
            >
              <FileExplorer />
            </div>

            {/* Resize handle */}
            <div
              className="resize-handle-horizontal flex-shrink-0"
              onMouseDown={startResize}
              style={{ width: 4, cursor: 'col-resize', background: 'var(--border)' }}
              onMouseEnter={(e) => (e.target.style.background = 'var(--accent)')}
              onMouseLeave={(e) => (e.target.style.background = 'var(--border)')}
            />
          </>
        )}

        {/* Editor */}
        <div className="editor-area flex-1 overflow-hidden flex flex-col">
          <EditorArea />
        </div>
      </div>

      {/* Status Bar */}
      {!zenMode && <StatusBar />}

      {/* Overlays */}
      <ToastContainer />
      {settingsOpen && <SettingsWindow />}
      {commandPaletteOpen && <CommandPalette />}
    </div>
  );
}

export default function WorkspaceClient({ session, username }) {
  return (
    <SessionProvider session={session}>
      <IDELayout session={session} username={username} />
    </SessionProvider>
  );
}
