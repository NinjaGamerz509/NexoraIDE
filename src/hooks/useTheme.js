'use client';
import { useEffect } from 'react';
import useIDEStore from '@/store/ideStore';

export function useTheme() {
  const { theme, setTheme } = useIDEStore();

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t) => {
      root.setAttribute('data-theme', t);
    };

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');

      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return { theme, setTheme };
}
