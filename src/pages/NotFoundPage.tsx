import React, { useEffect } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { publicApiService } from '../services/publicApiService';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateCollaborate?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateCollaborate,
}) => {
  useEffect(() => {
    const creatorName = publicApiService.getState().photographerName || 'Creative Portfolio';
    document.title = `404 — Archive Reference Not Found | ${creatorName}`;

    // Meta robots noindex
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const previousRobots = metaRobots ? metaRobots.content : null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex, nofollow';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      if (metaRobots && previousRobots) {
        metaRobots.content = previousRobots;
      }
    };
  }, []);

  return (
    <main
      id="not-found-container"
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] select-none text-center transition-colors duration-400"
    >
      <div className="space-y-6 max-w-lg">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full border border-neutral-300 dark:border-neutral-800 flex items-center justify-center opacity-70">
            <Compass className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
          </div>
        </div>

        <span className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-50 block">
          HTTP 404 — Catalogue Index Unresolved
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight">
          Monograph Not Located
        </h1>

        <p className="font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed tracking-wide max-w-md mx-auto">
          The requested portfolio collection, gallery spread, or regional location hub does not exist or has been curated into another archive series.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="return-to-canvas-btn"
            type="button"
            onClick={onNavigateHome}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 font-mono text-xs tracking-[0.2em] uppercase py-3 px-6 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-full hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Canvas</span>
          </button>

          {onNavigateCollaborate && (
            <button
              id="goto-inquiry-btn"
              type="button"
              onClick={onNavigateCollaborate}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 font-mono text-xs tracking-[0.2em] uppercase py-3 px-6 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
            >
              <span>Direct Studio Inquiry</span>
            </button>
          )}
        </div>

        <div className="pt-10 border-t border-neutral-200/60 dark:border-neutral-800/60 text-[10px] font-mono opacity-40 uppercase tracking-widest">
          Flame Creative Portfolio Platform • Error Reference 404
        </div>
      </div>
    </main>
  );
};
