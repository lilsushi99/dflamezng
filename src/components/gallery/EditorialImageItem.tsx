import React, { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '../../types/portfolio';
import { Maximize2 } from 'lucide-react';

interface EditorialImageItemProps {
  image: GalleryImage;
  className?: string;
  onSelectImage: (image: GalleryImage) => void;
  priority?: boolean;
}

export const EditorialImageItem: React.FC<EditorialImageItemProps> = ({
  image,
  className = '',
  onSelectImage,
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const el = itemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '100px 0px', threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  const imgSrc = imageError ? image.fallbackSrc : (image.src || image.fallbackSrc);

  return (
    <div
      ref={itemRef}
      id={`gallery-img-${image.id}`}
      onClick={() => onSelectImage(image)}
      className={`group relative cursor-pointer select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectImage(image);
        }
      }}
      aria-label={`Enlarge photograph ${image.caption}`}
    >
      {/* Physical Print Container - strictly flat solid design */}
      <div className="w-full relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300">
        <img
          src={imgSrc}
          alt={image.caption}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Minimal Hover Inspection Indicator */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] p-1.5 border border-[#E2DFD2] dark:border-[#262626] shadow-sm pointer-events-none">
          <Maximize2 className="w-3 h-3" />
        </div>
      </div>

      {/* Discrete Editorial Metadata below image */}
      <div className="mt-2.5 flex items-start justify-between font-editorial-sans text-[10px] tracking-[0.18em] uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-200">
        <div className="space-y-0.5 max-w-[80%]">
          <span className="font-medium block text-[11px] font-editorial-serif italic capitalize normal-case tracking-normal">
            {image.caption}
          </span>
          {image.subtitle && (
            <span className="block text-[9px] opacity-60 truncate">{image.subtitle}</span>
          )}
        </div>
        <span className="opacity-50 shrink-0 text-[9px]">{image.plateNumber}</span>
      </div>
    </div>
  );
};
