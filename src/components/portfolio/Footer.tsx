import React from 'react';
import { CASTEL_STUDIOS_URL } from '../../services/portfolioData';

export const Footer: React.FC = () => {
  return (
    <footer
      id="homepage-footer"
      className="w-full shrink-0 select-none mt-6 sm:mt-10 md:mt-12"
      aria-label="Site Footer"
    >
      {/* Subtle Horizontal Divider Line */}
      <div className="w-full border-t border-[#111111]/10 dark:border-[#FEFDF3]/10" />

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-5 sm:py-6 md:py-7 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 font-editorial-sans text-[8.5px] sm:text-[9.5px] md:text-[10px] tracking-[0.22em] uppercase text-[#111111]/70 dark:text-[#FEFDF3]/70">
        {/* Left: Copyright */}
        <div id="footer-copyright" className="text-center sm:text-left">
          <span>Flames Photography © 2026</span>
        </div>

        {/* Right: Design Credit */}
        <div id="footer-credit" className="text-center sm:text-right">
          <span>Designed by </span>
          <a
            id="link-castel-studios"
            href={CASTEL_STUDIOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#111111] dark:text-[#FEFDF3] underline underline-offset-4 hover:opacity-75 transition-opacity cursor-pointer font-medium"
          >
            Castel Studios
          </a>
        </div>
      </div>
    </footer>
  );
};
