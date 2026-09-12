import React, { useState, useEffect } from 'react';
import { publicApiService } from '../../services/publicApiService';
import { SocialIcon } from './SocialIcon';

export const SocialLinks: React.FC = () => {
  const [links, setLinks] = useState(publicApiService.getState().socialLinks);

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setLinks(state.socialLinks);
    });
  }, []);

  return (
    <nav
      id="social-links-nav"
      aria-label="Social and Portfolio Links"
      className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 md:gap-x-8 gap-y-3 select-none"
    >
      {links.map((link) =>
        link.display_mode === 'ICON' ? (
          <a
            key={link.id}
            id={`link-social-${link.id}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className="social-icon-glass w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-neutral-900 dark:text-neutral-50 opacity-90 hover:opacity-100 hover:scale-110 hover:-translate-y-0.5 transition-all duration-300"
          >
            <SocialIcon platformKey={link.platform_key || link.id} className="w-4 h-4 sm:w-[18px] sm:h-[18px] drop-shadow-sm" />
          </a>
        ) : (
          <a
            key={link.id}
            id={`link-social-${link.id}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-editorial-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase opacity-60 hover:opacity-100 transition-all duration-200 border-b border-transparent hover:border-current pb-0.5"
          >
            {link.label}
          </a>
        )
      )}
    </nav>
  );
};

