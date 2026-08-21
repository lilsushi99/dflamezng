import React, { useEffect, useState, useRef } from 'react';
import { publicApiService } from '../../services/publicApiService';

interface PhotoStackIntroProps {
  onComplete: () => void;
}

interface StackSlot {
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  rotation: number;
  width: string;
  height: string;
  zIndex: number;
}

const STACK_SLOTS: StackSlot[] = [
  { initialX: -40, initialY: 40, targetX: -260, targetY: -110, rotation: -7, width: 'w-36 sm:w-44 md:w-52', height: 'h-48 sm:h-58 md:h-70', zIndex: 11 },
  { initialX: 40, initialY: -30, targetX: 250, targetY: 100, rotation: 6, width: 'w-40 sm:w-48 md:w-56', height: 'h-48 sm:h-58 md:h-70', zIndex: 12 },
  { initialX: -20, initialY: -40, targetX: -290, targetY: 120, rotation: 5, width: 'w-44 sm:w-52 md:w-60', height: 'h-36 sm:h-42 md:h-48', zIndex: 13 },
  { initialX: 30, initialY: 30, targetX: 270, targetY: -130, rotation: -6, width: 'w-36 sm:w-44 md:w-50', height: 'h-48 sm:h-58 md:h-66', zIndex: 14 },
  { initialX: -10, initialY: 10, targetX: -120, targetY: -210, rotation: -3, width: 'w-40 sm:w-48 md:w-56', height: 'h-44 sm:h-52 md:h-62', zIndex: 15 },
  { initialX: 15, initialY: -15, targetX: 130, targetY: 210, rotation: 4, width: 'w-38 sm:w-46 md:w-54', height: 'h-46 sm:h-56 md:h-64', zIndex: 16 },
  { initialX: 0, initialY: 0, targetX: 0, targetY: 0, rotation: 0, width: 'w-44 sm:w-52 md:w-64', height: 'h-56 sm:h-66 md:h-80', zIndex: 17 },
];

export const PhotoStackIntro: React.FC<PhotoStackIntroProps> = ({ onComplete }) => {
  const [visibleStackCount, setVisibleStackCount] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [splashState, setSplashState] = useState(publicApiService.getState().splash);

  useEffect(() => {
    return publicApiService.subscribe((state) => {
      setSplashState(state.splash);
      if (!state.splash.isEnabled) {
        onCompleteRef.current();
      }
    });
  }, []);

  const signatureText = splashState.signatureText || splashState.photographerName || 'Flames Photography';
  const subtitleText = splashState.subtext;
  const images = splashState.images || [];
  const typingSpeed = splashState.typingSpeedMs || 65;
  const stackDuration = splashState.stackDurationMs || 3200;

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !splashState.isEnabled) {
      onCompleteRef.current();
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Step 1: Progressively stack physical photographic prints if any exist
    if (images.length > 0) {
      const stepDelay = Math.max(150, Math.floor(stackDuration / (images.length + 1)));
      images.forEach((_, index) => {
        const t = setTimeout(() => {
          setVisibleStackCount(index + 1);
        }, 300 + index * stepDelay);
        timers.push(t);
      });
    }

    // Step 2: Dissolve stack toward upper and lower tracks
    const dissolveTimer = setTimeout(() => {
      setIsDissolving(true);
    }, Math.max(2600, stackDuration));

    // Step 3: Complete transition and handover to live canvas
    const completeTimer = setTimeout(() => {
      onCompleteRef.current();
    }, Math.max(3400, stackDuration + 800));

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearTimeout(dissolveTimer);
      clearTimeout(completeTimer);
    };
  }, [images.length, stackDuration, splashState.isEnabled]);

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
      <div className="absolute z-40 text-center pointer-events-none px-4 max-w-4xl mx-auto">
        <h1
          id="typewriter-photographer-name"
          className="font-editorial-serif font-light text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-inherit"
        >
          {splashState.typewriterEnabled ? (
            signatureText.split('').map((char, i) => (
              <span
                key={`intro-char-${i}`}
                className="intro-char-reveal"
                style={{
                  animationDelay: `${i * typingSpeed}ms`,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))
          ) : (
            <span>{signatureText}</span>
          )}
        </h1>

        {subtitleText && (
          <div className="mt-4 font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.28em] uppercase intro-subtitle-reveal">
            {subtitleText}
          </div>
        )}
      </div>

      {/* 2. Real Physical Photographic Prints Stacking Progressively (Only if images exist in database) */}
      {images.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {images.map((img, idx) => {
            const slot = STACK_SLOTS[idx % STACK_SLOTS.length];
            const isVisible = idx < visibleStackCount;
            const disperseY = idx % 2 === 0 ? -280 : 280;
            const disperseX = (idx - 4.5) * 60;

            const currentX = isDissolving ? slot.targetX + disperseX : isVisible ? slot.targetX : slot.initialX;
            const currentY = isDissolving ? slot.targetY + disperseY : isVisible ? slot.targetY : slot.initialY;
            const currentRotation = isVisible ? (isDissolving ? 0 : slot.rotation) : 0;
            const currentScale = isDissolving ? 0.85 : isVisible ? 1 : 0.92;
            const currentOpacity = isDissolving ? 0 : isVisible ? 0.98 : 0;

            return (
              <div
                key={img.id}
                id={`splash-item-${idx + 1}`}
                style={{
                  zIndex: slot.zIndex,
                  transform: `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRotation}deg) scale(${currentScale})`,
                  transition: isDissolving
                    ? 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 650ms ease-out'
                    : 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms ease-out',
                  opacity: currentOpacity,
                }}
                className={`absolute ${slot.width} ${slot.height} bg-[#E2DFD2] dark:bg-[#202020] border border-[#111111]/10 dark:border-[#FEFDF3]/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden`}
              >
                <img
                  src={img.src}
                  alt={signatureText}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onLoad={() => setImagesLoaded((prev) => ({ ...prev, [img.id]: true }))}
                  onError={() => {
                    setImagesLoaded((prev) => ({ ...prev, [img.id]: true }));
                  }}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imagesLoaded[img.id] ? 'opacity-100' : 'opacity-90'
                  }`}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      )}

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
