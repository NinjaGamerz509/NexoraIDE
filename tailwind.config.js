/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme
        dark: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          panel: '#2d2d30',
          border: '#3e3e42',
          text: '#cccccc',
          textMuted: '#858585',
          accent: '#007acc',
          hover: '#2a2d2e',
          active: '#37373d',
          tab: '#2d2d30',
          tabActive: '#1e1e1e',
        },
        // Light theme
        light: {
          bg: '#ffffff',
          sidebar: '#f3f3f3',
          panel: '#f8f8f8',
          border: '#e4e4e4',
          text: '#333333',
          textMuted: '#717171',
          accent: '#007acc',
          hover: '#e8e8e8',
          active: '#d6d6d6',
          tab: '#ececec',
          tabActive: '#ffffff',
        },
        // Aqua theme
        aqua: {
          bg: '#0d1117',
          sidebar: '#0a1628',
          panel: '#0f1f35',
          border: '#1a3a5c',
          text: '#c9e8ff',
          textMuted: '#5a8fa8',
          accent: '#00d4ff',
          hover: '#0f2540',
          active: '#1a3a5c',
          tab: '#0f1f35',
          tabActive: '#0d1117',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'slide-out': 'slideOut 0.2s ease-in',
        'fade-in': 'fadeIn 0.15s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'toast-in': 'toastIn 0.3s ease-out',
        'toast-out': 'toastOut 0.3s ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        toastIn: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        toastOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
