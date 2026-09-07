import React, { useState, useEffect } from 'react';
import { publicApiService } from '../../services/publicApiService';

interface IdentityProps {
  isVisible?: boolean;
}

export const Identity: React.FC<IdentityProps> = ({ isVisible = true }) => {
  const [name, setName] = useState(publicApiService.getState().photographerName);
  const [subtext, setSubtext] = useState(publicApiService.getState().professionSubtitle);

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setName(state.photographerName);
      setSubtext(state.professionSubtitle);
    });
  }, []);

  return (
    <div
      id="central-identity"
      className={`text-center select-none py-1 md:py-2 transition-opacity duration-700 flex flex-col items-center justify-center ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h1 className="font-editorial-serif font-light clamp-masthead tracking-tight text-inherit transition-transform duration-500 hover:scale-[1.004] text-center px-1">
        {name || 'Gold Akinbade'}
      </h1>
      {subtext && (
        <p className="font-editorial-sans text-xs sm:text-sm md:text-base tracking-[0.22em] sm:tracking-[0.28em] uppercase text-neutral-600 dark:text-neutral-400 mt-2 sm:mt-3 text-center max-w-xl px-4">
          {subtext}
        </p>
      )}
    </div>
  );
};

