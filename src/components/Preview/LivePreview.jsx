'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useIDEStore from '@/store/ideStore';

const DEVICE_SIZES = {
  desktop: { width: '100%', height: '100%', icon: 'desktop_windows', label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', icon: 'tablet', label: 'Tablet' },
  mobile: { width: '375px', height: '667px', icon: 'smartphone', label: 'Mobile' },
};

export default function LivePreview({ width }) {
  const { previewUrl, togglePreview } = useIDEStore();
  const [device, setDevice] = useState('desktop');
  const [zoom, setZoom] = useState(100);
  const [dotsOpen, setDotsOpen] = useState(false);
  const [builtinBrowserUrl, setBuiltinBrowserUrl] = useState('');
  const [builtinBrowserOpen, setBuiltinBrowserOpen] = useState(false);
  const iframeRef = useRef();

  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const openInBuiltinBrowser = () => {
    setBuiltinBrowserUrl(previewUrl || 'about:blank');
    setBuiltinBrowserOpen(true);
    setDotsOpen(false);
  };

  const deviceSize = DEVICE_SIZES[device];

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--panel)' }}>
      {/* Preview toolbar */}
      <div
        className="flex items-center justify-between px-2 py-1 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', height: 35 }}
      >
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Preview</span>

          {/* Device toggles */}
          {Object.entries(DEVICE_SIZES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              title={val.label}
              className="flex items-center justify-center w-6 h-6 rounded"
              style={{
                color: device === key ? 'var(--accent)' : 'var(--text-muted)',
                background: device === key ? 'var(--active)' : 'transparent',
              }}
            >
              <span className="material-icons" style={{ fontSize: 14 }}>{val.icon}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {/* Zoom */}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{zoom}%</span>
          <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="flex items-center justify-center w-5 h-5 rounded" style={{ color: 'var(--text-muted)' }}>
            <span className="material-icons" style={{ fontSize: 12 }}>add</span>
          </button>
          <button onClick={() => setZoom(Math.max(25, zoom - 10))} className="flex items-center justify-center w-5 h-5 rounded" style={{ color: 'var(--text-muted)' }}>
            <span className="material-icons" style={{ fontSize: 12 }}>remove</span>
          </button>

          {/* Reload */}
          <button onClick={reload} title="Reload" className="flex items-center justify-center w-6 h-6 rounded" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-icons" style={{ fontSize: 14 }}>refresh</span>
          </button>

          {/* Three dots */}
          <div className="relative">
            <button
              onClick={() => setDotsOpen(!dotsOpen)}
              className="flex items-center justify-center w-6 h-6 rounded"
              style={{ color: 'var(--text-muted)', background: dotsOpen ? 'var(--active)' : 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
              onMouseLeave={(e) => { if (!dotsOpen) e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="material-icons" style={{ fontSize: 14 }}>more_vert</span>
            </button>
            {dotsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50"
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  minWidth: 160,
                }}
              >
                <button
                  onClick={openInBuiltinBrowser}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="material-icons" style={{ fontSize: 14 }}>open_in_browser</span>
                  Open in Browser
                </button>
                <button
                  onClick={() => { setZoom(100); setDotsOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="material-icons" style={{ fontSize: 14 }}>crop_free</span>
                  Reset Zoom
                </button>
              </motion.div>
            )}
          </div>

          {/* Close preview */}
          <button onClick={togglePreview} className="flex items-center justify-center w-6 h-6 rounded" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-icons" style={{ fontSize: 14 }}>close</span>
          </button>
        </div>
      </div>

      {/* Preview area */}
      {builtinBrowserOpen ? (
        <BuiltinBrowser
          url={builtinBrowserUrl}
          onClose={() => setBuiltinBrowserOpen(false)}
        />
      ) : (
        <div className="flex-1 overflow-auto flex items-start justify-center p-2" style={{ background: '#1a1a2e' }}>
          <div
            style={{
              width: deviceSize.width,
              height: deviceSize.height,
              maxWidth: '100%',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              background: '#fff',
              borderRadius: device !== 'desktop' ? 8 : 0,
              overflow: 'hidden',
              boxShadow: device !== 'desktop' ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {previewUrl ? (
              <iframe
                ref={iframeRef}
                src={previewUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts allow-same-origin"
                title="Live Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2" style={{ background: 'var(--bg)' }}>
                <span className="material-icons text-4xl" style={{ color: 'var(--text-muted)' }}>preview</span>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Save an HTML file to see preview
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BuiltinBrowser({ url, onClose }) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [inputUrl, setInputUrl] = useState(url);
  const iframeRef = useRef();

  const navigate = (u) => {
    setCurrentUrl(u);
    setInputUrl(u);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-2 py-1 flex-shrink-0"
        style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}
      >
        <button onClick={() => iframeRef.current && (iframeRef.current.src = iframeRef.current.src)} className="flex items-center justify-center w-6 h-6 rounded" style={{ color: 'var(--text-muted)' }}>
          <span className="material-icons" style={{ fontSize: 14 }}>refresh</span>
        </button>
        <input
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(inputUrl)}
          className="flex-1 text-xs px-2 py-1 rounded outline-none"
          style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
        />
        <button onClick={onClose} className="flex items-center justify-center w-6 h-6 rounded" style={{ color: 'var(--text-muted)' }}>
          <span className="material-icons" style={{ fontSize: 14 }}>close</span>
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src={currentUrl}
        style={{ flex: 1, border: 'none', background: '#fff' }}
        sandbox="allow-scripts allow-same-origin allow-forms"
        title="Built-in Browser"
      />
    </div>
  );
}
