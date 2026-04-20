'use client';
import { useState, useEffect, useRef } from 'react';
import useIDEStore from '@/store/ideStore';

const GOOGLE_FONTS = [
  // Monospace (editor fonts)
  { name: 'JetBrains Mono', category: 'Monospace' },
  { name: 'Fira Code', category: 'Monospace' },
  { name: 'Source Code Pro', category: 'Monospace' },
  { name: 'Roboto Mono', category: 'Monospace' },
  { name: 'Ubuntu Mono', category: 'Monospace' },
  { name: 'Inconsolata', category: 'Monospace' },
  { name: 'Space Mono', category: 'Monospace' },
  { name: 'Courier Prime', category: 'Monospace' },
  { name: 'IBM Plex Mono', category: 'Monospace' },
  { name: 'Overpass Mono', category: 'Monospace' },
  // Sans Serif
  { name: 'Inter', category: 'Sans Serif' },
  { name: 'Roboto', category: 'Sans Serif' },
  { name: 'Open Sans', category: 'Sans Serif' },
  { name: 'Lato', category: 'Sans Serif' },
  { name: 'Poppins', category: 'Sans Serif' },
  { name: 'Nunito', category: 'Sans Serif' },
  { name: 'Raleway', category: 'Sans Serif' },
  { name: 'Montserrat', category: 'Sans Serif' },
  // Serif
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Lora', category: 'Serif' },
];

export default function FontPicker({ onClose }) {
  const { fontFamily, setEditorSetting } = useIDEStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Monospace');
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  // Load Google Fonts dynamically
  useEffect(() => {
    const fontsToLoad = GOOGLE_FONTS.map((f) => f.name.replace(/ /g, '+')).join('|');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const filtered = GOOGLE_FONTS.filter((f) =>
    f.category === category && (!search || f.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden"
      style={{
        width: 260,
        height: 360,
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>Google Fonts</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search fonts..."
          className="w-full text-xs px-2 py-1 rounded outline-none"
          style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
          autoFocus
        />
      </div>

      {/* Categories */}
      <div className="flex gap-1 px-2 py-1.5" style={{ borderBottom: '1px solid var(--border)' }}>
        {['Monospace', 'Sans Serif', 'Serif'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: category === cat ? 'var(--accent)' : 'var(--hover)',
              color: category === cat ? '#fff' : 'var(--text-muted)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Font list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((font) => (
          <button
            key={font.name}
            onClick={() => {
              setEditorSetting('fontFamily', font.name);
              onClose();
            }}
            className="w-full flex flex-col px-3 py-2 text-left"
            style={{
              background: fontFamily === font.name ? 'var(--active)' : 'transparent',
              borderLeft: fontFamily === font.name ? '2px solid var(--accent)' : '2px solid transparent',
            }}
            onMouseEnter={(e) => { if (fontFamily !== font.name) e.currentTarget.style.background = 'var(--hover)'; }}
            onMouseLeave={(e) => { if (fontFamily !== font.name) e.currentTarget.style.background = 'transparent'; }}
          >
            <span className="text-xs" style={{ color: 'var(--text)', fontFamily: font.name }}>
              {font.name}
            </span>
            <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontFamily: font.name, fontSize: 10 }}>
              The quick brown fox jumps
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
