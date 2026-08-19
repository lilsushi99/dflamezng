import React, { useRef, useState, useEffect } from 'react';
import { ProjectGallery, GalleryImage } from '../../types/portfolio';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';

interface HorizontalProjectGalleryProps {
  project: ProjectGallery;
  onSelectImage: (image: GalleryImage) => void;
  onNavigateProject: (slug: string) => void;
  onNavigateHome: () => void;
}

export const HorizontalProjectGallery: React.FC<HorizontalProjectGalleryProps> = ({
  project,
  onSelectImage,
  onNavigateProject,
  onNavigateHome,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // Reset scroll to left when project changes
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [project.id]);

  // Handle horizontal mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag scroll sensitivity
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  // Convert wheel deltaY to horizontal scroll when hovering over the image strip
  const handleWheel = (e: React.WheelEvent) => {
    if (!trackRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      trackRef.current.scrollLeft += e.deltaY * 0.85;
    }
  };

  // Map each layoutRole to calibrated height & aspect-ratio proportions
  const getImageSizing = (img: GalleryImage, index: number) => {
    switch (img.layoutRole) {
      case 'lead-feature':
        return {
          containerClass: 'h-[46vh] sm:h-[54vh] md:h-[62vh] aspect-[3/4]',
          verticalAlign: 'self-end',
        };
      case 'secondary-portrait':
        return {
          containerClass: 'h-[42vh] sm:h-[48vh] md:h-[56vh] aspect-[2/3]',
          verticalAlign: 'self-center',
        };
      case 'wide-spread':
        return {
          containerClass: 'h-[38vh] sm:h-[44vh] md:h-[50vh] aspect-[16/10]',
          verticalAlign: 'self-end',
        };
      case 'offset-pair':
        return {
          containerClass: index % 2 === 0
            ? 'h-[44vh] sm:h-[50vh] md:h-[58vh] aspect-[4/5]'
            : 'h-[40vh] sm:h-[46vh] md:h-[52vh] aspect-[3/4]',
          verticalAlign: index % 2 === 0 ? 'self-start' : 'self-end',
        };
      case 'standalone':
        return {
          containerClass: 'h-[40vh] sm:h-[46vh] md:h-[54vh] aspect-[4/3]',
          verticalAlign: 'self-center',
        };
      default:
        return {
          containerClass: 'h-[42vh] sm:h-[50vh] md:h-[58vh] aspect-[4/5]',
          verticalAlign: 'self-center',
        };
    }
  };

  return (
    <article
      id={`project-gallery-${project.code}`}
      className="w-full min-h-screen flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 select-none bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400"
    >
      {/* ============================================================
          1. LARGE UPPER-LEFT EDITORIAL PROJECT TITLE
          Naturally breaks across lines, dominant serif typography
         ============================================================ */}
      <header className="px-5 sm:px-8 md:px-12 mb-6 sm:mb-8 md:mb-10 max-w-5xl">
        <div className="flex items-center space-x-3 font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.26em] uppercase opacity-50 mb-2">
          <span>Project {project.code}</span>
          <span>/</span>
          <span>{project.location}</span>
        </div>

        <h1 className="font-editorial-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.95] text-inherit">
          {project.title}
        </h1>
      </header>

      {/* ============================================================
          2. HORIZONTAL EDITORIAL IMAGE COMPOSITION
          Physical prints arranged in one long continuous horizontal strip
         ============================================================ */}
      <div
        id="horizontal-gallery-strip-container"
        className="w-full relative my-auto py-2 sm:py-4 overflow-hidden touch-pan-x"
      >
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          className={`w-full overflow-x-auto no-scrollbar flex items-center gap-6 sm:gap-8 md:gap-12 px-5 sm:px-8 md:px-12 cursor-grab active:cursor-grabbing ${
            isDragging ? 'select-none' : ''
          }`}
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {project.images.map((img, index) => {
            const { containerClass, verticalAlign } = getImageSizing(img, index);
            const isLoaded = imagesLoaded[img.id];

            return (
              <div
                key={img.id}
                id={`gallery-plate-${img.id}`}
                className={`relative shrink-0 group ${containerClass} ${verticalAlign} transition-transform duration-500 hover:scale-[1.012]`}
                onClick={() => onSelectImage(img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectImage(img);
                  }
                }}
                aria-label={`View ${img.caption}`}
              >
                {/* Print Surface */}
                <div className="w-full h-full relative overflow-hidden bg-[#E2DFD2]/40 dark:bg-[#181818] border border-[#111111]/8 dark:border-[#FEFDF3]/8 shadow-sm group-hover:shadow-md transition-all duration-300">
                  {/* Progressive loading placeholder shimmer */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-[#E2DFD2]/30 dark:bg-[#202020] animate-pulse" />
                  )}

                  <img
                    src={img.src}
                    alt={img.caption}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImagesLoaded((prev) => ({ ...prev, [img.id]: true }))}
                    onError={(e) => {
                      // Graceful fallback to verified editorial photography asset
                      const target = e.currentTarget;
                      if (target.src !== img.fallbackSrc) {
                        target.src = img.fallbackSrc;
                      }
                      setImagesLoaded((prev) => ({ ...prev, [img.id]: true }));
                    }}
                    className={`w-full h-full object-cover select-none transition-opacity duration-700 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    draggable={false}
                  />

                  {/* Restrained Plate Label & Inspector Action on Hover */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between font-editorial-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#FEFDF3]/90 dark:bg-[#111111]/90 backdrop-blur-[2px] border-t border-[#111111]/10 dark:border-[#FEFDF3]/10">
                    <span className="truncate max-w-[80%] font-medium">{img.caption}</span>
                    <Maximize2 className="w-3 h-3 shrink-0 opacity-70" />
                  </div>
                </div>

                {/* Subtle Plate Number Beneath Frame */}
                <div className="mt-2 flex items-center justify-between font-editorial-sans text-[9px] tracking-[0.22em] uppercase opacity-40 group-hover:opacity-75 transition-opacity">
                  <span>{img.plateNumber}</span>
                  <span className="text-[8px]">{img.orientation}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          3. PROJECT INFORMATION BELOW THE IMAGE SERIES
          Lower-Left: Year / Lower-Right: Project Story & Description
         ============================================================ */}
      <footer className="px-5 sm:px-8 md:px-12 mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-[#111111]/10 dark:border-[#FEFDF3]/10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* Lower-Left: Year & Archive Specifications */}
          <div className="space-y-2 font-editorial-sans">
            <div className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase opacity-50">
              Year of Release
            </div>
            <div className="text-xl sm:text-2xl font-editorial-serif font-light">
              {project.year}
            </div>
            <div className="text-[9px] tracking-[0.2em] uppercase opacity-60 pt-1">
              {project.images.length} Archival Plates / {project.category}
            </div>
          </div>

          {/* Lower-Right: Concise Project Story & Creative Direction */}
          <div className="max-w-xl space-y-3 font-editorial-sans">
            <div className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase opacity-50">
              Creative Narrative & Intent
            </div>
            <p className="text-xs sm:text-sm tracking-wide opacity-80 leading-relaxed">
              {project.description}
            </p>
            {project.statement && (
              <p className="font-editorial-serif italic text-base sm:text-lg opacity-90 leading-snug pt-1">
                {project.statement}
              </p>
            )}

            {/* Client / Creative Credits if available */}
            {(project.client || project.creativeDirection) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase opacity-60 pt-2 border-t border-[#111111]/5 dark:border-[#FEFDF3]/5">
                {project.client && <span>Client: {project.client}</span>}
                {project.client && project.creativeDirection && <span>•</span>}
                {project.creativeDirection && <span>Direction: {project.creativeDirection}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Nav Links: Return to Home / Next Project */}
        <div className="mt-8 sm:mt-12 pt-4 flex items-center justify-between font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase border-t border-[#111111]/5 dark:border-[#FEFDF3]/5">
          <button
            onClick={onNavigateHome}
            className="group inline-flex items-center space-x-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer border-b border-transparent hover:border-current pb-0.5"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Return to Canvas</span>
          </button>

          {project.nextProjectSlug && (
            <button
              onClick={() => onNavigateProject(project.nextProjectSlug!)}
              className="group inline-flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer border-b border-current pb-0.5"
            >
              <span>Next Project</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </footer>
    </article>
  );
};
