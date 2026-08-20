import React, { useState, useEffect } from 'react';
import { HeaderNav } from '../components/navigation/HeaderNav';
import { TopImageTrack } from '../components/portfolio/TopImageTrack';
import { BottomImageTrack } from '../components/portfolio/BottomImageTrack';
import { Identity } from '../components/portfolio/Identity';
import { SocialLinks } from '../components/portfolio/SocialLinks';
import { PhotoStackIntro } from '../components/portfolio/PhotoStackIntro';
import { ProjectsIndexModal } from '../components/portfolio/ProjectsIndexModal';
import { Footer } from '../components/portfolio/Footer';
import { PhotoAsset } from '../types/portfolio';
import { TOP_PHOTO_ASSETS, BOTTOM_PHOTO_ASSETS } from '../services/portfolioData';

interface HomePageProps {
  onNavigateGallery: (slug: string) => void;
  onNavigateCollaborate: () => void;
  introCompleted: boolean;
  onMarkIntroComplete: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateGallery,
  onNavigateCollaborate,
  introCompleted,
  onMarkIntroComplete,
}) => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  // Check if reduced motion is preferred
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !introCompleted) {
      onMarkIntroComplete();
    }
  }, [introCompleted, onMarkIntroComplete]);

  const handleOpenGallery = (projectIdOrCode: string) => {
    const slug = projectIdOrCode.replace(/^0+/, '');
    onNavigateGallery(slug);
  };

  const handleSelectProjectFromModal = (photo: PhotoAsset) => {
    setIsProjectsOpen(false);
    handleOpenGallery(photo.projectId || photo.projectCode);
  };

  return (
    <main
      id="portfolio-canvas"
      className="relative w-full min-h-screen overflow-x-clip flex flex-col justify-between select-none bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400 pt-0 pb-0 gap-2 sm:gap-4 md:gap-4"
    >
      {/* 0. Signature Typewriter & Real Photographic Stacking Intro Choreography */}
      {!introCompleted && (
        <PhotoStackIntro onComplete={onMarkIntroComplete} />
      )}

      {/* 1. Minimal Top Navigation */}
      <div
        className={`transition-opacity duration-700 shrink-0 ${
          introCompleted ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <HeaderNav
          onOpenProjects={() => setIsProjectsOpen(true)}
          onOpenInquiry={onNavigateCollaborate}
        />
      </div>

      {/* 2. Upper Photographic Field (Continuous Right-to-Left Opposing Motion) */}
      <div
        className={`w-full shrink-0 transition-opacity duration-1000 ${
          introCompleted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <TopImageTrack
          photos={TOP_PHOTO_ASSETS}
          onOpenGallery={handleOpenGallery}
          isIntroComplete={introCompleted}
        />
      </div>

      {/* 3. Minimalist Center Spatial Area: Large Photographer Name + Social Links Only */}
      <div
        id="central-canvas-area"
        className={`w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 relative z-30 my-auto py-2 sm:py-4 md:py-6 max-w-5xl mx-auto transition-opacity duration-700 ${
          introCompleted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Identity isVisible={introCompleted} />

        <div className="w-full max-w-2xl mx-auto mt-3 sm:mt-4 md:mt-5 text-center">
          <SocialLinks />
        </div>
      </div>

      {/* 4. Lower Photographic Field (Continuous Left-to-Right Opposing Motion) */}
      <div
        className={`w-full shrink-0 transition-opacity duration-1000 ${
          introCompleted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <BottomImageTrack
          photos={BOTTOM_PHOTO_ASSETS}
          onOpenGallery={handleOpenGallery}
          isIntroComplete={introCompleted}
        />
      </div>

      {/* 5. Minimal Site Footer (Divider + Flames Photography + Castel Studios Link) */}
      <div
        className={`w-full shrink-0 transition-opacity duration-1000 ${
          introCompleted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Footer />
      </div>

      {/* Projects Archive Modal */}
      <ProjectsIndexModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        onSelectProjectPhoto={handleSelectProjectFromModal}
      />
    </main>
  );
};
