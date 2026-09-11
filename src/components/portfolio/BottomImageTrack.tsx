import React, { useRef, useState, useEffect } from 'react';
import { PhotoAsset } from '../../types/portfolio';
import { PhotoPrint } from './PhotoPrint';

interface BottomImageTrackProps {
  photos: PhotoAsset[];
  onOpenGallery: (projectCode: string) => void;
  isIntroComplete: boolean;
}

export const BottomImageTrack: React.FC<BottomImageTrackProps> = ({
  photos,
  onOpenGallery,
  isIntroComplete,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSlowed, setIsSlowed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);
  const scrollPosRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Seamless continuous opposing motion (Left to Right reverse glide)
  useEffect(() => {
    if (!isIntroComplete) return;

    // Respect user's reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const el = trackRef.current;
    if (!el) return;

    if (scrollPosRef.current === null) {
      const singleSetWidth = el.scrollWidth / 3;
      scrollPosRef.current = singleSetWidth;
      el.scrollLeft = scrollPosRef.current;
    }

    let animationFrameId: number;

    const animate = (time: number) => {
      if (lastTimeRef.current !== null && el && scrollPosRef.current !== null && !isDragging) {
        const delta = time - lastTimeRef.current;
        const isMobile = window.innerWidth <= 768;
        const baseSpeed = isMobile ? 0.024 : 0.036;
        const slowedSpeed = isMobile ? 0.008 : 0.012;
        const speed = isPaused ? 0 : isSlowed ? slowedSpeed : baseSpeed;

        scrollPosRef.current -= speed * delta;

        const singleSetWidth = el.scrollWidth / 3;
        if (singleSetWidth > 0 && scrollPosRef.current <= 0) {
          scrollPosRef.current += singleSetWidth;
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
  }, [isPaused, isSlowed, isDragging, isIntroComplete]);

  // Mouse-drag to navigate faster through the track (desktop pointer only).
  // Purely additive: does not touch the auto-scroll speed/animation above -
  // it only pauses the automatic increment while dragging and hands the
  // exact same scrollPosRef back to it afterward so motion resumes exactly
  // where the animation loop left off.
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX);
    setDragStartScroll(trackRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const walk = (e.pageX - dragStartX) * 1.5;
    let next = dragStartScroll - walk;

    const singleSetWidth = trackRef.current.scrollWidth / 3;
    if (singleSetWidth > 0) {
      if (next >= singleSetWidth) next -= singleSetWidth;
      if (next < 0) next += singleSetWidth;
    }

    trackRef.current.scrollLeft = next;
    scrollPosRef.current = next;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging && trackRef.current) {
      scrollPosRef.current = trackRef.current.scrollLeft;
    }
    setIsDragging(false);
  };

  // Triple set for seamless infinite wrap
  const repeatedPhotos = [...photos, ...photos, ...photos];

  return (
    <section
      id="photographic-field-bottom"
      aria-label="Bottom Photographic Field"
      className="w-full relative pt-1 sm:pt-2 pb-5 sm:pb-7 md:pb-8 z-20 overflow-hidden touch-pan-y"
      onMouseEnter={() => setIsSlowed(true)}
      onMouseLeave={() => setIsSlowed(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={() => {
          setIsSlowed(false);
          handleMouseUpOrLeave();
        }}
        className={`w-full overflow-x-auto no-scrollbar flex items-end gap-2 sm:gap-3 md:gap-4 px-3 sm:px-6 md:px-8 select-none cursor-grab active:cursor-grabbing`}
      >
        {repeatedPhotos.map((photo, idx) => (
          <PhotoPrint
            key={`bot-${photo.id}-${idx}`}
            photo={photo}
            index={idx}
            onOpenGallery={onOpenGallery}
            onHoverStart={() => setIsPaused(true)}
            onHoverEnd={() => setIsPaused(false)}
          />
        ))}
      </div>
    </section>
  );
};
