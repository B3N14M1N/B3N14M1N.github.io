import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Home, FolderKanban, BookOpen, Sun, Moon, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/documentation', icon: BookOpen, label: 'Docs' },
];

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 backdrop-blur-md border-b border-border bg-surface/80">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Brand */}
        <NavLink
          to="/"
          className="text-lg font-bold text-primary tracking-tight"
          onClick={() => setOpen(false)}
        >
          BC
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-text-muted hover:text-primary hover:bg-primary/10'
                }`
              }
            >
              <span className="flex items-center gap-1.5">
                <Icon size={16} />
                {label}
              </span>
            </NavLink>
          ))}

          <button
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-text-muted hover:text-text"
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-surface/95 backdrop-blur-md">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-text-muted hover:text-primary hover:bg-primary/10'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => { toggleTheme(); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
