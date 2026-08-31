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
  const [navState, setNavState] = useState(() => {
    const s = publicApiService.getState();
    return {
      logoType: s.logoType || 'TEXT',
      logoImagePath: s.logoImagePath,
      logoText: s.navbarLogoText || s.photographerName || '',
      projectsLabel: s.navbarProjectsLabel || 'PROJECTS',
      contactLabel: s.navbarContactLabel || 'CONTACT',
      themeToggleVisible: s.themeToggleVisible !== false,
    };
  });

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setNavState({
        logoType: state.logoType || 'TEXT',
        logoImagePath: state.logoImagePath,
        logoText: state.navbarLogoText || state.photographerName || '',
        projectsLabel: state.navbarProjectsLabel || 'PROJECTS',
        contactLabel: state.navbarContactLabel || 'CONTACT',
        themeToggleVisible: state.themeToggleVisible !== false,
      });
    });
  }, []);

  return (
    <>
      <header
        id="header-nav"
        className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 md:px-12 py-4 md:py-5 flex items-center justify-between text-xs tracking-[0.2em] uppercase font-editorial-sans select-none pointer-events-auto bg-transparent"
      >
        {/* Top Left Wordmark / Logo */}
        <div className="flex items-center">
          {navState.logoType === 'IMAGE' && navState.logoImagePath ? (
            <img
              id="header-logo-image"
              src={navState.logoImagePath}
              alt={navState.logoText || 'Logo'}
              className="h-6 sm:h-7 md:h-8 w-auto max-w-[160px] object-contain cursor-default"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="font-medium opacity-90 transition-opacity hover:opacity-100 cursor-default">
              {navState.logoText}
            </span>
          )}
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

          {/* Theme Toggle */}
          {navState.themeToggleVisible && (
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
          )}

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
