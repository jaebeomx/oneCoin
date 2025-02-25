/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'background-elevated': 'var(--background-elevated)',
        'background-secondary': 'var(--background-secondary)',

        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },

        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },

        error: 'var(--error)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
      },
    },
  },
  plugins: [],
  darkMode: 'selector',
  corePlugins: {
    // preflight: false, // 기본 스타일 제거 옵션
  },
};
