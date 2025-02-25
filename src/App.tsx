import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import './App.css';

function App() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white transition-colors duration-200 dark:bg-gray-900">
      <button onClick={toggleTheme} className="rounded bg-blue-500 px-4 py-2 text-white">
        {isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
      </button>
    </div>
  );
}

export default App;
