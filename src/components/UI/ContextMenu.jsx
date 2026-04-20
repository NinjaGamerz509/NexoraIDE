'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('contextmenu', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('contextmenu', handler);
    };
  }, [onClose]);

  // Adjust position if near edge
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - items.length * 32 - 10);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
      className="context-menu"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {items.map((item, i) => (
        item.separator ? (
          <div key={i} className="context-menu-separator" />
        ) : (
          <button
            key={i}
            onClick={() => { item.action?.(); onClose(); }}
            className="context-menu-item w-full text-left"
            style={{ color: item.danger ? '#f87171' : 'var(--text)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {item.icon && (
              <span className="material-icons" style={{ fontSize: 14 }}>{item.icon}</span>
            )}
            {item.label}
            {item.shortcut && (
              <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>{item.shortcut}</span>
            )}
          </button>
        )
      ))}
    </motion.div>
  );
}
