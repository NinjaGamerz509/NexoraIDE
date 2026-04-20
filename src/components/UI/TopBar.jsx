'use client';
import { useState } from 'react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import useIDEStore from '@/store/ideStore';

export default function TopBar({ username, session }) {
  const { toggleZenMode, zenMode, openSettings, togglePreview, previewVisible } = useIDEStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div
      className="flex items-center justify-between px-3 flex-shrink-0"
      style={{
        height: 40,
        background: 'var(--panel)',
        borderBottom: '1px solid var(--border)',
        zIndex: 100,
      }}
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 relative">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            style={{ objectFit: 'contain' }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
          My IDE
        </span>
      </div>

      {/* Center - menu items */}
      <div className="flex items-center gap-1">
        {['File', 'Edit', 'View', 'Run'].map((item) => (
          <button
            key={item}
            className="px-2 py-1 text-xs rounded transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.target.style.background = 'var(--hover)')}
            onMouseLeave={(e) => (e.target.style.background = 'transparent')}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right - actions + user */}
      <div className="flex items-center gap-2">
        {/* Zen mode */}
        <button
          onClick={toggleZenMode}
          title={zenMode ? 'Exit Zen Mode (F11)' : 'Zen Mode (F11)'}
          className="flex items-center justify-center w-7 h-7 rounded transition-colors"
          style={{ color: zenMode ? 'var(--accent)' : 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.target.style.background = 'var(--hover)')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent')}
        >
          <span className="material-icons" style={{ fontSize: 18 }}>
            {zenMode ? 'fullscreen_exit' : 'fullscreen'}
          </span>
        </button>

        {/* Live Preview */}
        <button
          onClick={togglePreview}
          title="Toggle Live Preview (Ctrl+Shift+V)"
          className="flex items-center justify-center w-7 h-7 rounded transition-colors"
          style={{ color: previewVisible ? 'var(--accent)' : 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.target.style.background = 'var(--hover)')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent')}
        >
          <span className="material-icons" style={{ fontSize: 18 }}>preview</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => openSettings('appearance')}
          title="Settings"
          className="flex items-center justify-center w-7 h-7 rounded transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.target.style.background = 'var(--hover)')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent')}
        >
          <span className="material-icons" style={{ fontSize: 18 }}>settings</span>
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded transition-colors"
            style={{ color: 'var(--text)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="avatar"
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <span className="material-icons" style={{ fontSize: 18 }}>account_circle</span>
            )}
            <span className="text-xs">{username}</span>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden"
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  minWidth: 160,
                  zIndex: 1000,
                }}
              >
                <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                    {session?.user?.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    @{username}
                  </p>
                </div>
                <button
                  onClick={() => openSettings('appearance')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="material-icons" style={{ fontSize: 14 }}>settings</span>
                  Settings
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors"
                  style={{ color: '#f87171' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="material-icons" style={{ fontSize: 14 }}>logout</span>
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
