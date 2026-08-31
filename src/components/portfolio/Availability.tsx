import React, { useState, useEffect } from 'react';
import { publicApiService } from '../../services/publicApiService';

export const Availability: React.FC = () => {
  const [availPrimary, setAvailPrimary] = useState(publicApiService.getState().availabilityPrimary || 'Open to Travel');
  const [availSecondary, setAvailSecondary] = useState(publicApiService.getState().availabilitySecondary || 'Worldwide & Commissions');

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      if (state.availabilityPrimary) setAvailPrimary(state.availabilityPrimary);
      if (state.availabilitySecondary) setAvailSecondary(state.availabilitySecondary);
    });
  }, []);

  return (
    <div
      id="metadata-availability"
      className="text-right font-editorial-sans text-[11px] sm:text-xs tracking-[0.25em] uppercase opacity-75 select-none"
    >
      <span className="block font-medium">{availPrimary}</span>
      <span className="block text-[9px] sm:text-[10px] tracking-[0.2em] opacity-60 mt-0.5">{availSecondary}</span>
    </div>
  );
};

