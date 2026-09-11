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
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border border-neutral-900/15 dark:border-white/15 text-neutral-900 dark:text-neutral-100 opacity-70 hover:opacity-100 hover:border-neutral-900/40 dark:hover:border-white/40 hover:scale-105 transition-all duration-200"
          >
            <SocialIcon platformKey={link.platform_key || link.id} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
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

