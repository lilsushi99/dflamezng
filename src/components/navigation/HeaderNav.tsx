import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon, Menu } from 'lucide-react';
import { MobileNavDrawer } from './MobileNavDrawer';
import { publicApiService } from '../../services/publicApiService';

interface HeaderNavProps {
  onOpenProjects: () => void;
  onOpenInquiry: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenProjects, onOpenInquiry }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navState, setNavState] = useState(() => ({
    logoText: publicApiService.getState().navbarLogoText || publicApiService.getState().photographerName || 'Flames Photography',
    projectsLabel: publicApiService.getState().navbarProjectsLabel || 'PROJECTS',
    contactLabel: publicApiService.getState().navbarContactLabel || 'CONTACT',
  }));

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setNavState({
        logoText: state.navbarLogoText || state.photographerName || 'Flames Photography',
        projectsLabel: state.navbarProjectsLabel || 'PROJECTS',
        contactLabel: state.navbarContactLabel || 'CONTACT',
      });
    });
  }, []);

  return (
    <>
      <header
        id="header-nav"
        className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 md:px-12 py-4 md:py-5 flex items-center justify-between text-xs tracking-[0.2em] uppercase font-editorial-sans select-none pointer-events-auto bg-transparent"
      >
        {/* Top Left Wordmark: Photographer name */}
        <div className="flex items-center">
          <span className="font-medium opacity-90 transition-opacity hover:opacity-100 cursor-default">
            {navState.logoText}
          </span>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-5 sm:space-x-6 md:space-x-8">
          {/* Desktop/Tablet Links: Hidden on Mobile */}
          <button
            id="btn-nav-projects"
            onClick={onOpenProjects}
            className="hidden md:inline-block opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-[11px] tracking-[0.22em]"
          >
            {navState.projectsLabel}
          </button>

          <button
            id="btn-nav-contact"
            onClick={onOpenInquiry}
            className="hidden md:inline-block opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-[11px] tracking-[0.22em]"
          >
            {navState.contactLabel}
          </button>

          {/* Theme Toggle (Always visible on mobile & desktop) */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle light and dark mode"
            className="flex items-center space-x-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer py-1"
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

          {/* Mobile Only: Minimal 3-Line Hamburger Icon */}
          <button
            id="btn-mobile-hamburger"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile navigation menu"
            className="md:hidden p-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Menu className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenProjects={onOpenProjects}
        onOpenContact={onOpenInquiry}
      />
    </>
  );
};
