import React from 'react';
import { SOCIAL_LINKS } from '../../services/portfolioData';

export const SocialLinks: React.FC = () => {
  return (
    <nav
      id="social-links-nav"
      aria-label="Social and Portfolio Links"
      className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 md:gap-x-10 gap-y-2 font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase select-none"
    >
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.id}
          id={`link-social-${link.id}`}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-70 hover:opacity-100 transition-all duration-200 border-b border-transparent hover:border-current pb-0.5"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};
