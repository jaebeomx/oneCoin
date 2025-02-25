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
    <div>
      <Switch id="theme-mode" checked={isDarkMode} onCheckedChange={toggleTheme} />
      <label htmlFor="theme-mode" className="select-none text-foreground">
        다크 모드
      </label>
      <Outlet />
    </div>
  );
}

export default Menubar;
