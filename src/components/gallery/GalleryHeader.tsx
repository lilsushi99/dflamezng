import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { publicApiService } from '../../services/publicApiService';

interface GalleryHeaderProps {
  onNavigateHome: () => void;
  projectTitle: string;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  onNavigateHome,
  projectTitle,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [photographerName, setPhotographerName] = useState(
    publicApiService.getState().photographerName || 'Flames Photography'
  );

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      if (state.photographerName) {
        setPhotographerName(state.photographerName);
      }
    });
  }, []);

  return (
    <nav
      id="gallery-nav"
      aria-label="Gallery Navigation"
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 md:px-12 py-3.5 sm:py-4 md:py-5 flex items-center justify-between text-xs tracking-[0.22em] uppercase font-editorial-sans select-none bg-[#FEFDF3]/95 dark:bg-[#111111]/95 backdrop-blur-[4px] border-b border-[#111111]/5 dark:border-[#FEFDF3]/5 transition-colors duration-400"
    >
      {/* LEFT: HOME / Back arrow control */}
      <div className="flex items-center">
        <button
          id="btn-gallery-back-home"
          onClick={onNavigateHome}
          className="group inline-flex items-center space-x-1.5 sm:space-x-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer py-1 pr-2 sm:pr-3"
          aria-label="Return to homepage"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="font-medium text-[10px] sm:text-xs tracking-[0.24em]">Home</span>
        </button>
      </div>

      {/* CENTER: Project Name Only */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none px-4 max-w-[45vw] sm:max-w-[50vw]">
        <span className="font-editorial-sans text-[10px] sm:text-[11px] md:text-xs tracking-[0.24em] uppercase opacity-75 truncate block">
          {projectTitle}
        </span>
      </div>

      {/* RIGHT: Wordmark + Theme Toggle */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <span className="font-medium opacity-80 text-[10px] sm:text-xs tracking-[0.22em] hidden md:inline-block">
          {photographerName}
        </span>

        <button
          id="btn-gallery-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle light and dark mode"
          className="flex items-center space-x-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer py-1"
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
      </div>
    </nav>
  );
};
