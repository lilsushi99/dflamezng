import React, { useState, useEffect } from 'react';
import { publicApiService } from '../../services/publicApiService';

interface IdentityProps {
  isVisible?: boolean;
}

type TextCaseMode = 'as_written' | 'sentence' | 'upper' | 'lower';

/**
 * Applies an admin-selected case treatment to display text WITHOUT mutating
 * the underlying stored value - "As Written" always preserves the original
 * text exactly as typed in the admin panel.
 */
function applyTextCase(text: string, mode: TextCaseMode | undefined): string {
  if (!text) return text;
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'sentence': {
      const lower = text.toLowerCase();
      return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    }
    case 'as_written':
    default:
      return text;
  }
}

export const Identity: React.FC<IdentityProps> = ({ isVisible = true }) => {
  const [name, setName] = useState(publicApiService.getState().photographerName);
  const [subtext, setSubtext] = useState(publicApiService.getState().professionSubtitle);
  const [mainTextCase, setMainTextCase] = useState(publicApiService.getState().mainTextCase);
  const [subtextCase, setSubtextCase] = useState(publicApiService.getState().subtextCase);

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setName(state.photographerName);
      setSubtext(state.professionSubtitle);
      setMainTextCase(state.mainTextCase);
      setSubtextCase(state.subtextCase);
    });
  }, []);

  const displayName = applyTextCase(name || 'Gold Akinbade', mainTextCase);
  const displaySubtext = subtext ? applyTextCase(subtext, subtextCase) : '';

  return (
    <div
      id="central-identity"
      className={`text-center select-none py-1 md:py-2 transition-opacity duration-700 flex flex-col items-center justify-center ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/*
        Main Text: largest/boldest element in the hierarchy, using a
        slightly softened black/white shade (never pure #000/#fff) so it
        reads as premium rather than harsh, in both themes.
      */}
      <h1 className="font-editorial-serif font-light clamp-masthead tracking-tight text-neutral-900 dark:text-neutral-50 transition-transform duration-500 hover:scale-[1.004] text-center px-1">
        {displayName}
      </h1>
      {displaySubtext && (
        /*
          Subtext: smaller than Main Text, visible but lower emphasis than
          Main Text, with tight/near-zero letter spacing (not the wide
          tracking used before) and no forced uppercase - case is entirely
          admin-controlled via subtextCase.
        */
        <p className="font-editorial-sans text-xs sm:text-sm md:text-base tracking-tight text-neutral-600 dark:text-neutral-400 mt-2 sm:mt-3 mb-3 sm:mb-4 text-center max-w-xl px-4">
          {displaySubtext}
        </p>
      )}
    </div>
  );
};
