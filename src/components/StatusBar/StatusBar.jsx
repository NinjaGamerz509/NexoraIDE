'use client';
import useIDEStore from '@/store/ideStore';

export default function StatusBar() {
  const {
    openTabs, activeTab, editorZoom, theme, setTheme,
    openSettings, folderName,
  } = useIDEStore();

  const activeFile = openTabs.find((t) => t.path === activeTab);

  return (
    <div
      className="status-bar flex items-center justify-between px-3 flex-shrink-0 select-none"
      style={{
        height: 24,
        background: 'var(--accent)',
        color: '#fff',
        fontSize: 12,
        zIndex: 100,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {folderName && (
          <span className="flex items-center gap-1 opacity-90">
            <span className="material-icons" style={{ fontSize: 12 }}>folder</span>
            {folderName}
          </span>
        )}
        {activeFile && (
          <span className="flex items-center gap-1 opacity-90">
            <span className="material-icons" style={{ fontSize: 12 }}>description</span>
            {activeFile.name}
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 opacity-90">
        {editorZoom !== 100 && (
          <span>{editorZoom}%</span>
        )}
        {activeFile && (
          <>
            <span>{activeFile.language || 'plaintext'}</span>
            <span>UTF-8</span>
            <span>Spaces: 2</span>
          </>
        )}
        <button
          onClick={() => openSettings('appearance')}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="material-icons" style={{ fontSize: 12 }}>palette</span>
          {theme}
        </button>
      </div>
    </div>
  );
}
