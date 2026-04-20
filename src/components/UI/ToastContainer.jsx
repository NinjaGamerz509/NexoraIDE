'use client';
import { motion, AnimatePresence } from 'framer-motion';
import useIDEStore from '@/store/ideStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useIDEStore();

  const ICONS = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };
  const COLORS = { success: '#4caf50', error: '#f44336', info: 'var(--accent)', warning: '#ff9800' };

  return (
    <div className="fixed bottom-8 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg pointer-events-auto"
            style={{
              background: 'var(--panel)',
              border: `1px solid ${COLORS[toast.type]}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              maxWidth: 280,
            }}
            onClick={() => removeToast(toast.id)}
          >
            <span className="material-icons flex-shrink-0" style={{ fontSize: 16, color: COLORS[toast.type] }}>
              {ICONS[toast.type] || 'info'}
            </span>
            <span className="text-xs" style={{ color: 'var(--text)' }}>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
