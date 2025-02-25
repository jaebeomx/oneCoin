import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import './App.css';
import Test from '@/test';

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
    <div className="min-h-screen bg-background p-10">
      <button onClick={toggleTheme} className="rounded bg-blue-500 px-4 py-2 text-white">
        {isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
      </button>
      <Test />
    </div>
  );
}

export default App;
