import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '../../types/portfolio';

interface GalleryImageViewerProps {
  image: GalleryImage | null;
  allImages: GalleryImage[];
  onClose: () => void;
  onSelectImage: (img: GalleryImage) => void;
}

export const GalleryImageViewer: React.FC<GalleryImageViewerProps> = ({
  image,
  allImages,
  onClose,
  onSelectImage,
}) => {
  if (!image) return null;

  const currentIndex = allImages.findIndex((img) => img.id === image.id);

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + allImages.length) % allImages.length;
    onSelectImage(allImages[prevIdx]);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % allImages.length;
    onSelectImage(allImages[nextIdx]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allImages, onClose]);

  return (
    <div
      id="gallery-focused-viewer"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] select-none transition-colors duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top action bar */}
      <div className="absolute top-5 left-5 right-5 sm:top-8 sm:left-8 sm:right-8 flex items-center justify-between font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase opacity-75">
        <div>
          <span>{image.plateNumber}</span>
          <span className="opacity-40 mx-2">/</span>
          <span className="opacity-60">{image.filename}</span>
        </div>

        <button
          id="btn-close-focused-viewer"
          onClick={onClose}
          className="flex items-center space-x-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer p-1"
          aria-label="Close image inspection viewer"
        >
          <span>Close</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Photographic Focus Frame */}
      <div className="relative max-w-5xl max-h-[78vh] w-full flex flex-col items-center justify-center">
        <div className="relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 max-h-[72vh] flex items-center justify-center">
          <img
            src={image.src || image.fallbackSrc}
            alt={image.caption}
            onError={(e) => {
              (e.target as HTMLImageElement).src = image.fallbackSrc;
            }}
            className="w-auto h-auto max-h-[72vh] max-w-full object-contain"
          />
        </div>

        {/* Minimal caption & subtitle below frame */}
        <div className="mt-4 w-full text-center space-y-1 font-editorial-sans">
          <p className="text-xs sm:text-sm tracking-wide opacity-90 font-editorial-serif italic text-base sm:text-lg">
            {image.caption}
          </p>
          {image.subtitle && (
            <p className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase opacity-60">
              {image.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Left/Right Prev/Next Arrows */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous plate"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next plate"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom info footer */}
      <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 flex items-center justify-between font-editorial-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase opacity-50">
        <span>Good Akingbade Studio Archive</span>
        <span>Use ← / → keys to browse series</span>
      </div>
    </div>
  );
};
