import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { PhotoAsset } from '../../types/portfolio';
import { ImageAssetService } from '../../services/imageAssetService';

interface GalleryViewerModalProps {
  photo: PhotoAsset | null;
  onClose: () => void;
}

export const GalleryViewerModal: React.FC<GalleryViewerModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  const project = ImageAssetService.getProjectByCode(photo.projectCode);

  return (
    <div
      id="gallery-viewer-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/85 backdrop-blur-[2px] p-4 sm:p-6 md:p-10 transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="gallery-viewer-container"
        className="w-full max-w-5xl mx-auto my-6 sm:my-10 bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] border border-[#E2DFD2] dark:border-[#262626] p-6 sm:p-8 md:p-12 relative shadow-2xl transition-colors duration-300"
      >
        {/* Close Button */}
        <button
          id="btn-close-gallery-viewer"
          onClick={onClose}
          className="absolute top-6 right-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1"
          aria-label="Close project gallery viewer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Project Header Header */}
        <div className="border-b border-[#111111]/15 dark:border-[#FEFDF3]/15 pb-6 mb-8 sm:mb-10 pr-10">
          <div className="flex items-center space-x-3 text-[10px] sm:text-[11px] tracking-[0.25em] font-editorial-sans uppercase opacity-60 mb-2">
            <span>Project {project.code}</span>
            <span>/</span>
            <span>{project.year}</span>
            {project.client && (
              <>
                <span>/</span>
                <span>{project.client}</span>
              </>
            )}
          </div>

          <h2 className="font-editorial-serif text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05]">
            {project.title}
          </h2>

          <p className="mt-3 font-editorial-sans text-xs sm:text-sm tracking-wide opacity-80 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Selected Primary Image */}
        <div className="mb-10">
          <div className="w-full max-h-[70vh] bg-neutral-200 dark:bg-neutral-900 overflow-hidden flex items-center justify-center">
            <img
              src={photo.src || photo.fallbackSrc}
              alt={photo.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = photo.fallbackSrc;
              }}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
          <div className="mt-3 flex items-center justify-between font-editorial-sans text-[10px] tracking-[0.2em] uppercase opacity-70">
            <span>{photo.title} — Plate {photo.filename}</span>
            <span>{photo.location || 'Nigeria'}</span>
          </div>
        </div>

        {/* Project Gallery Plates (1.1.jpg, 1.2.jpg, 1.3.jpg, etc.) */}
        <div className="mt-12 pt-8 border-t border-[#111111]/15 dark:border-[#FEFDF3]/15">
          <div className="flex items-center justify-between mb-6 font-editorial-sans text-[11px] tracking-[0.22em] uppercase opacity-75">
            <span>Series Contact Plates ({project.images.length} frames)</span>
            <span className="text-[9px] opacity-60">Grouped Asset Pattern: {project.code}.x.jpg</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {project.images.map((imgItem, idx) => (
              <div
                key={`gallery-item-${imgItem.filename}-${idx}`}
                className="group relative flex flex-col space-y-2"
              >
                <div className="w-full aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <img
                    src={imgItem.src}
                    alt={imgItem.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="font-editorial-sans text-[9px] tracking-[0.16em] uppercase opacity-70 leading-tight">
                  <span className="font-medium block">{imgItem.filename}</span>
                  <span className="opacity-60 truncate block">{imgItem.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation within Modal */}
        <div className="mt-12 pt-6 border-t border-[#111111]/15 dark:border-[#FEFDF3]/15 flex items-center justify-between font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase">
          <button
            onClick={onClose}
            className="border-b border-current pb-0.5 opacity-70 hover:opacity-100 cursor-pointer"
          >
            ← Return to Canvas
          </button>
          <span className="opacity-50">Gold Akingbade Studio Archive</span>
        </div>
      </div>
    </div>
  );
};
