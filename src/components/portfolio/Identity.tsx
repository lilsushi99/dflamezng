import React, { useState, useEffect } from 'react';
import { publicApiService } from '../../services/publicApiService';

interface IdentityProps {
  isVisible?: boolean;
}

export const Identity: React.FC<IdentityProps> = ({ isVisible = true }) => {
  const [name, setName] = useState(publicApiService.getState().photographerName);

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setName(state.photographerName);
    });
  }, []);

  return (
    <div
      id="central-identity"
      className={`text-center select-none py-1 md:py-2 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h1 className="font-editorial-serif font-light clamp-masthead tracking-tight text-inherit transition-transform duration-500 hover:scale-[1.004] text-center px-1">
        {name}
      </h1>
      <p className="sr-only">Fashion & Editorial Art Direction Photography</p>
    </div>
  );
};

