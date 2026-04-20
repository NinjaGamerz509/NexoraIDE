'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useIDEStore from '@/store/ideStore';
import EmojiPicker from '@/components/UI/EmojiPicker';
import FontPicker from '@/components/UI/FontPicker';

const PANELS = [
  { id: 'explorer', icon: 'folder', title: 'Explorer' },
  { id: 'search', icon: 'search', title: 'Search' },
  { id: 'git', icon: 'merge_type', title: 'Source Control' },
];

export default function ActivityBar() {
  const { activePanel, setActivePanel, sidebarVisible, toggleSidebar, openSettings } = useIDEStore();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);

  const handlePanelClick = (id) => {
    if (activePanel === id && sidebarVisible) {
      toggleSidebar();
    } else {
      setActivePanel(id);
      if (!sidebarVisible) toggleSidebar();
    }
  };

  return (
    <div
      className="activity-bar flex flex-col items-center py-2 flex-shrink-0"
      style={{
        width: 48,
        background: 'var(--sidebar)',
        borderRight: '1px solid var(--border)',
        zIndex: 50,
      }}
    >
      {/* Top panels */}
      <div className="flex flex-col items-center gap-1 flex-1">
        {PANELS.map((panel) => (
          <button
            key={panel.id}
            onClick={() => handlePanelClick(panel.id)}
            title={panel.title}
            className="relative flex items-center justify-center w-10 h-10 rounded transition-all"
            style={{
              color: activePanel === panel.id && sidebarVisible ? 'var(--text)' : 'var(--text-muted)',
              background: activePanel === panel.id && sidebarVisible ? 'var(--active)' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!(activePanel === panel.id && sidebarVisible))
                e.currentTarget.style.background = 'var(--hover)';
            }}
            onMouseLeave={(e) => {
              if (!(activePanel === panel.id && sidebarVisible))
                e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Active indicator line */}
            {activePanel === panel.id && sidebarVisible && (
              <motion.div
                layoutId="activePanel"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r"
                style={{ background: 'var(--accent)' }}
              />
            )}
            <span className="material-icons" style={{ fontSize: 20 }}>{panel.icon}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="w-6 my-1" style={{ height: 1, background: 'var(--border)' }} />

        {/* Emoji picker btn */}
        <div className="relative">
          <button
            onClick={() => { setEmojiOpen(!emojiOpen); setFontOpen(false); }}
            title="Emoji Picker"
            className="flex items-center justify-center w-10 h-10 rounded transition-all text-lg"
            style={{
              color: emojiOpen ? 'var(--accent)' : 'var(--text-muted)',
              background: emojiOpen ? 'var(--active)' : 'transparent',
            }}
            onMouseEnter={(e) => { if (!emojiOpen) e.currentTarget.style.background = 'var(--hover)'; }}
            onMouseLeave={(e) => { if (!emojiOpen) e.currentTarget.style.background = 'transparent'; }}
          >
            😊
          </button>
          <AnimatePresence>
            {emojiOpen && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-full top-0 ml-2 z-50"
              >
                <EmojiPicker onClose={() => setEmojiOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Font picker btn */}
        <div className="relative">
          <button
            onClick={() => { setFontOpen(!fontOpen); setEmojiOpen(false); }}
            title="Google Fonts"
            className="flex items-center justify-center w-10 h-10 rounded transition-all"
            style={{
              color: fontOpen ? 'var(--accent)' : 'var(--text-muted)',
              background: fontOpen ? 'var(--active)' : 'transparent',
            }}
            onMouseEnter={(e) => { if (!fontOpen) e.currentTarget.style.background = 'var(--hover)'; }}
            onMouseLeave={(e) => { if (!fontOpen) e.currentTarget.style.background = 'transparent'; }}
          >
            <span className="material-icons" style={{ fontSize: 20 }}>text_fields</span>
          </button>
          <AnimatePresence>
            {fontOpen && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-full top-0 ml-2 z-50"
              >
                <FontPicker onClose={() => setFontOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom - settings */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => openSettings('appearance')}
          title="Settings"
          className="flex items-center justify-center w-10 h-10 rounded transition-all"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <span className="material-icons" style={{ fontSize: 20 }}>settings</span>
        </button>
      </div>
    </div>
  );
}
