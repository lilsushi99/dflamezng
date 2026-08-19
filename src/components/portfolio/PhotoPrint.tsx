import React, { useState } from 'react';
import { PhotoAsset } from '../../types/portfolio';
import { ArrowUpRight } from 'lucide-react';

interface PhotoPrintProps {
  photo: PhotoAsset;
  index: number;
  onOpenGallery: (projectCode: string) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export const PhotoPrint: React.FC<PhotoPrintProps> = ({
  photo,
  index,
  onOpenGallery,
  onHoverStart,
  onHoverEnd,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isActiveMobile, setIsActiveMobile] = useState(false);

  const imgSrc = imageError ? photo.fallbackSrc : (photo.src || photo.fallbackSrc);

  const handleMouseEnter = () => {
    onHoverStart?.();
  };

  const handleMouseLeave = () => {
    onHoverEnd?.();
  };

  const handleTouch = (e: React.MouseEvent | React.TouchEvent) => {
    // On mobile touch devices: first tap highlights and elevates, second tap navigates to gallery route
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      if (!isActiveMobile) {
        setIsActiveMobile(true);
        return;
      }
    }
    onOpenGallery(photo.projectCode);
  };

  return (
    <div
      id={`photo-print-${photo.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTouch}
      className={`group relative shrink-0 cursor-pointer select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        photo.widthClass
      } ${photo.heightClass} ${photo.verticalOffset || ''} ${
        isActiveMobile
          ? 'scale-[1.04] z-30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
          : 'hover:scale-[1.04] hover:z-30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenGallery(photo.projectCode);
        }
      }}
      aria-label={`Open gallery for ${photo.title} in project ${photo.projectName}`}
    >
      {/* Physical photographic print container */}
      <div className="w-full h-full relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300">
        <img
          src={imgSrc}
          alt={photo.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Restrained Non-Obscuring Action Tag (Editorial Outfit font) */}
        <div
          className={`absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none transition-all duration-300 ${
            isActiveMobile
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          <div className="bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] px-2.5 py-1 text-[9px] sm:text-[10px] tracking-[0.22em] font-editorial-sans uppercase flex items-center space-x-1.5 border border-[#E2DFD2] dark:border-[#262626] shadow-sm">
            <span>View Gallery</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </div>

          <span className="bg-[#FEFDF3]/90 dark:bg-[#111111]/90 text-[#111111] dark:text-[#FEFDF3] px-2 py-1 text-[8px] sm:text-[9px] tracking-[0.2em] font-editorial-sans uppercase border border-[#E2DFD2]/60 dark:border-[#262626]/60">
            {photo.projectCode}
          </span>
        </div>
      </div>

      {/* Discrete bottom print label metadata */}
      <div
        className={`mt-1.5 flex items-center justify-between text-[9px] tracking-[0.18em] font-editorial-sans uppercase transition-opacity duration-300 ${
          isActiveMobile ? 'opacity-80' : 'opacity-0 group-hover:opacity-60'
        }`}
      >
        <span className="truncate max-w-[120px]">{photo.title}</span>
        <span>{photo.year}</span>
      </div>
    </div>
  );
};
