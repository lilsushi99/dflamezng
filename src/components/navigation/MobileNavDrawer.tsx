import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { publicApiService } from '../../services/publicApiService';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProjects: () => void;
  onOpenContact: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenProjects,
  onOpenContact,
}) => {
  const [navState, setNavState] = useState(() => ({
    projectsLabel: publicApiService.getState().navbarProjectsLabel || 'PROJECTS',
    contactLabel: publicApiService.getState().navbarContactLabel || 'CONTACT',
    studioName: publicApiService.getState().studioName || publicApiService.getState().photographerName || 'Flames Photography',
  }));

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setNavState({
        projectsLabel: state.navbarProjectsLabel || 'PROJECTS',
        contactLabel: state.navbarContactLabel || 'CONTACT',
        studioName: state.studioName || state.photographerName || 'Flames Photography',
      });
    });
  }, []);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelectProjects = () => {
    onClose();
    onOpenProjects();
  };

  const handleSelectContact = () => {
    onClose();
    onOpenContact();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="mobile-drawer-backdrop"
        className={`fixed inset-0 z-50 bg-[#111111]/60 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Slide-in Side Drawer */}
      <div
        id="mobile-drawer-panel"
        className={`fixed top-0 right-0 bottom-0 z-50 w-64 max-w-[80vw] bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] border-l border-[#111111]/10 dark:border-[#FEFDF3]/10 shadow-2xl flex flex-col justify-between p-6 transition-transform duration-300 ease-out md:hidden select-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Drawer Header with Minimal Close Icon */}
        <div className="flex items-center justify-between pb-6 border-b border-[#111111]/10 dark:border-[#FEFDF3]/10">
          <span className="font-editorial-sans text-[10px] tracking-[0.25em] uppercase opacity-50">
            Menu
          </span>
          <button
            id="btn-close-mobile-drawer"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex flex-col space-y-8 my-auto font-editorial-sans text-sm tracking-[0.25em] uppercase">
          <button
            id="btn-mobile-nav-projects"
            onClick={handleSelectProjects}
            className="text-left py-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            {navState.projectsLabel}
          </button>

          <button
            id="btn-mobile-nav-contact"
            onClick={handleSelectContact}
            className="text-left py-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            {navState.contactLabel}
          </button>
        </nav>

        {/* Minimal Footer */}
        <div className="pt-6 border-t border-[#111111]/10 dark:border-[#FEFDF3]/10 font-editorial-sans text-[9px] tracking-[0.22em] uppercase opacity-50">
          <span>{navState.studioName}</span>
        </div>
      </div>
    </>
  );
};
