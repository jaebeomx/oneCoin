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
      <div className="mt-2 flex items-center justify-end gap-2 px-10">
        <Switch
          id="theme-mode"
          checked={isDarkMode}
          onCheckedChange={toggleTheme}
          showThemeIcons={true}
        />
        <label htmlFor="theme-mode" className="cursor-pointer select-none text-foreground">
          {isDarkMode ? 'dark mode' : 'light mode'}
        </label>
      </div>
      <Outlet />
    </div>
  );
}

export default Menubar;
