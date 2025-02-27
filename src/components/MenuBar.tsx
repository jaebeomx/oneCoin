import { Outlet } from 'react-router-dom';
import { Switch } from './ui/switch';
import { useThemeStore } from '../store/themeStore';
import { useEffect } from 'react';
function Menubar() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="w-full">
      <div className="mt-2 flex items-center justify-start gap-2 px-5">
        <Switch id="theme-mode" checked={isDarkMode} onCheckedChange={toggleTheme} />
        <label htmlFor="theme-mode" className="select-none text-foreground">
          다크 모드
        </label>
      </div>
      <Outlet />
    </div>
  );
}

export default Menubar;
