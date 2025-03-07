import { Outlet } from 'react-router-dom';
import { Switch } from './ui/switch';
import { useThemeStore } from '../store/themeStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, File, SquarePen, ChartCandlestick } from 'lucide-react';

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 pl-10">
          <Link to="/">
            <Button variant="outline">
              <Home />
            </Button>
          </Link>
          <Link to="/editor">
            <Button variant="outline">
              <SquarePen />
            </Button>
          </Link>
          <Link to="/article">
            <Button variant="outline">
              <File />
            </Button>
          </Link>
          <Link to="/exchange">
            <Button variant="outline">
              <ChartCandlestick />
            </Button>
          </Link>
        </div>
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
      </div>
      <Outlet />
    </div>
  );
}

export default Menubar;
