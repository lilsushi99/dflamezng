import React, { useEffect, useState, useRef } from 'react';
import { INTRO_STACK_ITEMS } from '../../services/introStackData';
import { publicApiService } from '../../services/publicApiService';

interface PhotoStackIntroProps {
  onComplete: () => void;
}

export const PhotoStackIntro: React.FC<PhotoStackIntroProps> = ({ onComplete }) => {
  const [visibleStackCount, setVisibleStackCount] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [fullWordmark, setFullWordmark] = useState(publicApiService.getState().photographerName || 'Gold Akingbade');
  const [subtitle, setSubtitle] = useState(publicApiService.getState().professionSubtitle || 'Photography & Art Direction');

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      if (state.photographerName) setFullWordmark(state.photographerName);
      if (state.professionSubtitle) setSubtitle(state.professionSubtitle);
    });
  }, []);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onCompleteRef.current();
      return;
    }

    // Step 1: Progressively stack physical photographic prints around center
    const timers: NodeJS.Timeout[] = [];
    INTRO_STACK_ITEMS.forEach((item, index) => {
      const t = setTimeout(() => {
        setVisibleStackCount(index + 1);
      }, item.delayMs);
      timers.push(t);
    });

    // Step 2: Dissolve stack toward upper and lower tracks
    const dissolveTimer = setTimeout(() => {
      setIsDissolving(true);
    }, 3600);

    // Step 3: Complete transition and handover to live canvas
    const completeTimer = setTimeout(() => {
      onCompleteRef.current();
    }, 4400);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearTimeout(dissolveTimer);
      clearTimeout(completeTimer);
    };
  }, []); // Run once on mount

  return (
    <div
      id="intro-choreography-overlay"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] pointer-events-none transition-opacity duration-700 select-none overflow-hidden ${
        isDissolving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes smoothCharReveal {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes introSubtitleFade {
          0% {
            opacity: 0;
            transform: translateY(2px);
          }
          100% {
            opacity: 0.6;
            transform: translateY(0);
          }
        }
        .intro-char-reveal {
          display: inline-block;
          opacity: 0;
          animation: smoothCharReveal 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: opacity, transform;
        }
        .intro-subtitle-reveal {
          opacity: 0;
          animation: introSubtitleFade 600ms ease-out 1050ms forwards;
          will-change: opacity, transform;
        }
      `}</style>

      {/* 1. Central Photographer Identity with Smooth Fluid Typewriter Reveal */}
      <div className="absolute z-40 text-center pointer-events-none px-4">
        <h1
          id="typewriter-photographer-name"
          className="font-editorial-serif font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-inherit"
        >
          {fullWordmark.split('').map((char, i) => (
            <span
              key={`intro-char-${i}`}
              className="intro-char-reveal"
              style={{
                animationDelay: `${i * 65}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <div
          className="mt-4 font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.28em] uppercase intro-subtitle-reveal"
        >
          {subtitle}
        </div>
      </div>

      {/* 2. Real Physical Photographic Prints Stacking Progressively */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {INTRO_STACK_ITEMS.map((item, idx) => {
          const isVisible = idx < visibleStackCount;
          // Target dissolved offsets: disperse smoothly toward upper and lower track positions
          const disperseY = idx % 2 === 0 ? -280 : 280;
          const disperseX = (idx - 4.5) * 60;

          const currentX = isDissolving ? item.targetX + disperseX : isVisible ? item.targetX : item.initialX;
          const currentY = isDissolving ? item.targetY + disperseY : isVisible ? item.targetY : item.initialY;
          const currentRotation = isVisible ? (isDissolving ? 0 : item.rotation) : 0;
          const currentScale = isDissolving ? 0.85 : isVisible ? 1 : 0.92;
          const currentOpacity = isDissolving ? 0 : isVisible ? 0.98 : 0;

          return (
            <div
              key={item.id}
              id={`splash-item-${idx + 1}`}
              style={{
                zIndex: item.zIndex,
                transform: `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotation}deg) scale(${currentScale})`,
                transition: isDissolving
                  ? 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms ease-out'
                  : 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease-out',
                opacity: currentOpacity,
              }}
              className={`absolute ${item.width} ${item.height} bg-[#E2DFD2] dark:bg-[#202020] border border-[#111111]/10 dark:border-[#FEFDF3]/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden`}
            >
              <img
                src={item.photo.src}
                alt={item.photo.title}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                onLoad={() => setImagesLoaded((prev) => ({ ...prev, [item.id]: true }))}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== item.photo.fallbackSrc) {
                    target.src = item.photo.fallbackSrc;
                  }
                  setImagesLoaded((prev) => ({ ...prev, [item.id]: true }));
                }}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imagesLoaded[item.id] ? 'opacity-100' : 'opacity-90'
                }`}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* 3. Understated Skip Control */}
      <button
        id="btn-skip-intro"
        onClick={() => onCompleteRef.current()}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 pointer-events-auto font-editorial-sans text-[10px] tracking-[0.22em] uppercase opacity-50 hover:opacity-100 transition-opacity cursor-pointer border-b border-transparent hover:border-current pb-0.5"
      >
        Skip Entrance →
      </button>
    </div>
  );
};
