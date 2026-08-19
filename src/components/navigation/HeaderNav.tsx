import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

interface HeaderNavProps {
  onOpenProjects: () => void;
  onOpenInquiry: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenProjects, onOpenInquiry }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      id="header-nav"
      className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 md:px-12 py-4 md:py-5 flex items-center justify-between text-xs tracking-[0.2em] uppercase font-editorial-sans select-none pointer-events-auto"
    >
      {/* Top Left Wordmark */}
      <div className="flex items-center space-x-3">
        <span className="font-medium opacity-90 transition-opacity hover:opacity-100 cursor-default">
          Good Akingbade
        </span>
        <span className="hidden sm:inline-block opacity-40 text-[10px]">/</span>
        <span className="hidden sm:inline-block opacity-50 text-[10px] tracking-[0.25em]">
          Selected Works 2024–2026
        </span>
      </div>

      {/* Top Right Navigation & Theme Controls */}
      <div className="flex items-center space-x-6 sm:space-x-8">
        <button
          id="btn-nav-projects"
          onClick={onOpenProjects}
          className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-[11px] tracking-[0.22em]"
        >
          Projects
        </button>

        <button
          id="btn-nav-inquire"
          onClick={onOpenInquiry}
          className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-[11px] tracking-[0.22em] hidden sm:inline-block"
        >
          Inquire
        </button>

        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle light and dark mode"
          className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer py-1"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden md:inline text-[10px] tracking-[0.2em]">Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 stroke-[1.5]" />
              <span className="hidden md:inline text-[10px] tracking-[0.2em]">Light</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
