import React, { useRef, useState, useEffect } from 'react';
import { ProjectGallery, GalleryImage } from '../../types/portfolio';
import { ArrowRight } from 'lucide-react';

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
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSlowed, setIsSlowed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const scrollPosRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  // Triple set for seamless infinite wrap
  const repeatedImages = [...project.images, ...project.images, ...project.images];

  // Reset scroll to 0 when project changes
  useEffect(() => {
    scrollPosRef.current = 0;
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [project.id]);

  // Seamless continuous horizontal movement (Right to Left glide)
  useEffect(() => {
    // Respect user's reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const el = trackRef.current;
    if (!el) return;

    let animationFrameId: number;

    const animate = (time: number) => {
      if (lastTimeRef.current !== null && el && !isDragging) {
        const delta = time - lastTimeRef.current;
        // Calibrated smooth editorial glide speed
        const isMobile = window.innerWidth <= 768;
        const baseSpeed = isMobile ? 0.022 : 0.030;
        const slowedSpeed = isMobile ? 0.006 : 0.009;
        const speed = isPaused ? 0 : isSlowed ? slowedSpeed : baseSpeed;

        scrollPosRef.current += speed * delta;

        // Content width of single 6-image sequence is scrollWidth / 3
        const singleSetWidth = el.scrollWidth / 3;
        if (singleSetWidth > 0 && scrollPosRef.current >= singleSetWidth) {
          scrollPosRef.current -= singleSetWidth;
        }

        el.scrollLeft = scrollPosRef.current;
      }
      lastTimeRef.current = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTimeRef.current = null;
    };
  }, [isPaused, isSlowed, isDragging, project.id]);

  // Handle horizontal mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeftState(trackRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    if (isDragging && trackRef.current) {
      scrollPosRef.current = trackRef.current.scrollLeft;
    }
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag scroll sensitivity
    trackRef.current.scrollLeft = scrollLeftState - walk;
    scrollPosRef.current = trackRef.current.scrollLeft;
  };

  // Convert wheel deltaY to horizontal scroll when hovering over the image strip
  const handleWheel = (e: React.WheelEvent) => {
    if (!trackRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      trackRef.current.scrollLeft += e.deltaY * 0.85;
      scrollPosRef.current = trackRef.current.scrollLeft;
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
      id={`project-gallery-${project.id}`}
      className="w-full min-h-screen flex flex-col justify-between pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 select-none bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400"
    >
      {/* ============================================================
          1. DIRECT EDITORIAL PROJECT TITLE (No project numbers/locations)
         ============================================================ */}
      <header className="px-4 sm:px-8 md:px-12 mb-4 sm:mb-6 md:mb-8 max-w-5xl">
        <h1 className="font-editorial-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[0.95] text-inherit">
          {project.title}
        </h1>
      </header>

      {/* ============================================================
          2. CONTINUOUS HORIZONTAL EDITORIAL IMAGE TRACK
          Seamless continuous glide with tighter spacing matching homepage tracks
         ============================================================ */}
      <div
        id="horizontal-gallery-strip-container"
        className="w-full relative my-auto py-2 sm:py-4 overflow-hidden touch-pan-x"
        onMouseEnter={() => setIsSlowed(true)}
        onMouseLeave={() => setIsSlowed(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          className={`w-full overflow-x-auto no-scrollbar flex items-center gap-2 sm:gap-3 md:gap-4 px-4 sm:px-8 md:px-12 cursor-grab active:cursor-grabbing ${
            isDragging ? 'select-none' : ''
          }`}
        >
          {repeatedImages.map((img, idx) => {
            const originalIndex = idx % project.images.length;
            const { containerClass, verticalAlign } = getImageSizing(img, originalIndex);
            const isLoaded = imagesLoaded[`${img.id}-${idx}`];

            return (
              <div
                key={`gallery-plate-${img.id}-${idx}`}
                id={`gallery-plate-${img.id}-${idx}`}
                className={`relative shrink-0 group cursor-pointer ${containerClass} ${verticalAlign} transition-transform duration-500 hover:scale-[1.015]`}
                onClick={() => onSelectImage(img)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectImage(img);
                  }
                }}
                aria-label={`View photograph from ${project.title}`}
              >
                {/* Clean Photographic Print Surface (NO hover overlays or text) */}
                <div className="w-full h-full relative overflow-hidden bg-[#E2DFD2]/40 dark:bg-[#181818] border border-[#111111]/8 dark:border-[#FEFDF3]/8 shadow-sm group-hover:shadow-md transition-all duration-300">
                  {/* Progressive loading placeholder shimmer */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-[#E2DFD2]/30 dark:bg-[#202020] animate-pulse" />
                  )}

                  <img
                    src={img.src}
                    alt={project.title}
                    loading={idx < 6 ? 'eager' : 'lazy'}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onLoad={() => setImagesLoaded((prev) => ({ ...prev, [`${img.id}-${idx}`]: true }))}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== img.fallbackSrc) {
                        target.src = img.fallbackSrc;
                      }
                      setImagesLoaded((prev) => ({ ...prev, [`${img.id}-${idx}`]: true }));
                    }}
                    className={`w-full h-full object-cover select-none transition-opacity duration-700 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          3. PROJECT INFORMATION BELOW THE IMAGE SERIES
          LEFT: Year of Release & Category
          RIGHT: Story
         ============================================================ */}
      <footer className="px-4 sm:px-8 md:px-12 mt-6 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-[#111111]/10 dark:border-[#FEFDF3]/10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-8 max-w-7xl mx-auto">
          {/* LEFT: Year of Release & Category */}
          <div className="space-y-5 font-editorial-sans shrink-0">
            <div className="space-y-1">
              <div className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase opacity-50">
                Year of Release
              </div>
              <div className="text-lg sm:text-xl font-editorial-serif font-light">
                {project.year}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase opacity-50">
                Category
              </div>
              <div className="text-xs sm:text-[13px] tracking-[0.2em] uppercase font-editorial-sans opacity-85">
                {project.category}
              </div>
            </div>
          </div>

          {/* RIGHT: Story */}
          <div className="max-w-xl space-y-2 font-editorial-sans">
            <div className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase opacity-50">
              Story
            </div>
            <p className="text-xs sm:text-sm tracking-wide opacity-80 leading-relaxed font-light">
              {project.story || project.description}
            </p>
          </div>
        </div>

        {/* Bottom Navigation: Next Project Only (Loops 1->2->3->4->5->1) */}
        {project.nextProjectSlug && (
          <div className="mt-8 sm:mt-10 pt-4 flex items-center justify-end font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase border-t border-[#111111]/5 dark:border-[#FEFDF3]/5">
            <button
              id="btn-gallery-next-project"
              onClick={() => onNavigateProject(project.nextProjectSlug!)}
              className="group inline-flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer border-b border-current pb-0.5"
            >
              <span>Next Project</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </footer>
    </article>
  );
};
