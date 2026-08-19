import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, ArrowLeft } from 'lucide-react';

interface GalleryHeaderProps {
  onNavigateHome: () => void;
  projectCode: string;
  projectTitle: string;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  onNavigateHome,
  projectCode,
  projectTitle,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      id="gallery-nav"
      aria-label="Gallery Navigation"
      className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 md:px-12 py-4 md:py-6 flex items-center justify-between text-xs tracking-[0.22em] uppercase font-editorial-sans select-none bg-[#FEFDF3]/95 dark:bg-[#111111]/95 backdrop-blur-[4px] border-b border-[#111111]/5 dark:border-[#FEFDF3]/5 transition-colors duration-400"
    >
      {/* Left: Minimal HOME Control */}
      <button
        id="btn-gallery-back-home"
        onClick={onNavigateHome}
        className="group inline-flex items-center space-x-2 opacity-75 hover:opacity-100 transition-opacity cursor-pointer py-1 pr-3"
        aria-label="Return to homepage canvas"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="font-medium text-[11px] sm:text-xs tracking-[0.24em]">Home</span>
      </button>

      {/* Center: Contextual Project Indicator (Restrained) */}
      <div className="hidden md:flex items-center space-x-3 text-[10px] tracking-[0.25em] opacity-50">
        <span>Project {projectCode}</span>
        <span>/</span>
        <span className="truncate max-w-[260px]">{projectTitle}</span>
      </div>

      {/* Right: Theme Toggle & Wordmark */}
      <div className="flex items-center space-x-6">
        <button
          id="btn-gallery-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle light and dark mode"
          className="flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer py-1"
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5 stroke-[1.5]" />
          ) : (
            <Sun className="w-3.5 h-3.5 stroke-[1.5]" />
          )}
          <span className="hidden sm:inline text-[10px] tracking-[0.2em]">
            {theme === 'light' ? 'Dark' : 'Light'}
          </span>
        </button>

        <span className="font-medium opacity-80 text-[11px] sm:text-xs tracking-[0.22em] hidden sm:inline-block">
          Good Akingbade
        </span>
      </div>
    </nav>
  );
};
