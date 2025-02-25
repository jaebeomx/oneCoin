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
    <div className="bg-background min-h-screen p-10">
      <div className="bg-background-elevated rounded-lg p-4">
        <button onClick={toggleTheme} className="rounded bg-blue-500 px-4 py-2 text-white">
          {isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
        </button>
        <p className="text-text-primary">기본 텍스트</p>
        <p className="text-text-secondary">부가 설명</p>
        <div className="border-border-primary border p-4">
          <p className="text-error">에러 메시지</p>
        </div>
      </div>
    </div>
  );
}

export default App;
