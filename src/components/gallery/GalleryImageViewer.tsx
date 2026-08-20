import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '../../types/portfolio';

interface GalleryImageViewerProps {
  image: GalleryImage | null;
  allImages: GalleryImage[];
  projectTitle: string;
  onClose: () => void;
  onSelectImage: (img: GalleryImage) => void;
}

export const GalleryImageViewer: React.FC<GalleryImageViewerProps> = ({
  image,
  allImages,
  projectTitle,
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
      {/* Top action bar: Clean top-left, simple close icon at top-right */}
      <div className="absolute top-5 left-5 right-5 sm:top-8 sm:left-8 sm:right-8 flex items-center justify-between">
        {/* Clean top-left area (no plate number or technical filenames) */}
        <div aria-hidden="true" />

        {/* Top-right close icon */}
        <button
          id="btn-close-focused-viewer"
          onClick={onClose}
          className="p-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-inherit"
          aria-label="Close image preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Photographic Focus Frame */}
      <div className="relative max-w-5xl max-h-[76vh] w-full flex flex-col items-center justify-center">
        <div className="relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 max-h-[68vh] flex items-center justify-center shadow-lg border border-[#111111]/8 dark:border-[#FEFDF3]/8">
          <img
            src={image.src || image.fallbackSrc}
            alt={projectTitle}
            onError={(e) => {
              (e.target as HTMLImageElement).src = image.fallbackSrc;
            }}
            className="w-auto h-auto max-h-[68vh] max-w-full object-contain"
          />
        </div>

        {/* Project title beneath frame (Project title only, NO individual image caption/number/location) */}
        <div className="mt-4 sm:mt-5 w-full text-center space-y-1 font-editorial-sans">
          <h2 className="font-editorial-serif text-base sm:text-lg md:text-xl font-light tracking-wide text-inherit">
            {projectTitle}
          </h2>
        </div>
      </div>

      {/* Left/Right Navigation Controls across current project series */}
      {allImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous photograph in series"
            className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 p-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next photograph in series"
            className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 p-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </>
      )}

      {/* Bottom info footer: Studio archive text & arrow key instruction */}
      <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row items-center justify-between gap-2 font-editorial-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase opacity-50 text-center sm:text-left">
        <span>Gold Akingbade Studio Archive</span>
        <span>Use arrow keys to browse series</span>
      </div>
    </div>
  );
};
