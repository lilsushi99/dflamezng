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

  const handleTouch = () => {
    // On mobile touch devices: first tap highlights, second tap / direct click navigates to gallery route
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      if (!isActiveMobile) {
        setIsActiveMobile(true);
        return;
      }
    }
    onOpenGallery(photo.projectId || photo.projectCode);
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
          ? 'scale-[1.03] z-30 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
          : 'hover:scale-[1.03] hover:z-30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenGallery(photo.projectId || photo.projectCode);
        }
      }}
      aria-label={`Open gallery for project ${photo.projectName}`}
    >
      {/* Physical photographic print container */}
      <div className="w-full h-full relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300">
        <img
          src={imgSrc}
          alt={photo.projectName || 'Photography Print'}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Minimal Action Overlay: ONLY 'VIEW GALLERY' positioned at bottom-left */}
        <div
          className={`absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 pointer-events-none transition-all duration-300 ${
            isActiveMobile
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          <div className="bg-[#FEFDF3]/95 dark:bg-[#111111]/95 text-[#111111] dark:text-[#FEFDF3] px-2.5 py-1 sm:px-3 sm:py-1.5 text-[8.5px] sm:text-[9.5px] tracking-[0.22em] font-editorial-sans uppercase flex items-center space-x-1.5 border border-[#111111]/15 dark:border-[#FEFDF3]/20 shadow-sm backdrop-blur-[2px]">
            <span>View Gallery</span>
            <ArrowUpRight className="w-2.5 h-2.5 opacity-75" />
          </div>
        </div>
      </div>
    </div>
  );
};
