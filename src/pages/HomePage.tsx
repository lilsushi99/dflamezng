import React, { useState, useEffect } from 'react';
import { HeaderNav } from '../components/navigation/HeaderNav';
import { TopImageTrack } from '../components/portfolio/TopImageTrack';
import { BottomImageTrack } from '../components/portfolio/BottomImageTrack';
import { Identity } from '../components/portfolio/Identity';
import { Location } from '../components/portfolio/Location';
import { Availability } from '../components/portfolio/Availability';
import { SocialLinks } from '../components/portfolio/SocialLinks';
import { CollaborationButton } from '../components/portfolio/CollaborationButton';
import { PhotoStackIntro } from '../components/portfolio/PhotoStackIntro';
import { ProjectsIndexModal } from '../components/portfolio/ProjectsIndexModal';
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

  const handleOpenGalleryByCode = (projectCode: string) => {
    const slug = projectCode.replace(/^0+/, '');
    onNavigateGallery(slug);
  };

  const handleSelectProjectFromModal = (photo: PhotoAsset) => {
    setIsProjectsOpen(false);
    handleOpenGalleryByCode(photo.projectCode);
  };

  return (
    <main
      id="portfolio-canvas"
      className="relative w-full min-h-screen overflow-x-clip flex flex-col justify-between select-none bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400 py-3 sm:py-6 md:py-8 gap-4 sm:gap-6 md:gap-8"
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
          onOpenGallery={handleOpenGalleryByCode}
          isIntroComplete={introCompleted}
        />
      </div>

      {/* 3. Calm Center Spatial Area with Editorial Typography, Location, Availability, Socials & Form */}
      <div
        id="central-canvas-area"
        className={`w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 relative z-30 my-auto py-2 sm:py-4 md:py-6 max-w-7xl mx-auto transition-opacity duration-700 ${
          introCompleted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Desktop 3-column Layout / Mobile Balanced Stacked Architecture */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Left Metadata: Location */}
          <div className="hidden md:flex w-full md:w-1/4 justify-center md:justify-start order-2 md:order-1">
            <Location />
          </div>

          {/* Center Masthead: Photographer Name */}
          <div className="w-full md:w-2/4 flex flex-col items-center justify-center order-1 md:order-2">
            <Identity isVisible={introCompleted} />

            {/* Mobile-only compact metadata row directly beneath masthead */}
            <div className="flex md:hidden items-center justify-between w-full max-w-xs px-2 pt-1 font-editorial-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase opacity-70">
              <span>Akure / Lagos</span>
              <span className="opacity-40">•</span>
              <span>Open to Travel</span>
            </div>
          </div>

          {/* Right Metadata: Availability */}
          <div className="hidden md:flex w-full md:w-1/4 justify-center md:justify-end order-3">
            <Availability />
          </div>
        </div>

        {/* Social Navigation and Inquiry Action beneath Identity */}
        <div className="w-full max-w-3xl mx-auto mt-3 sm:mt-4 md:mt-6 space-y-2 sm:space-y-3 text-center">
          <SocialLinks />
          <CollaborationButton onClick={onNavigateCollaborate} />
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
          onOpenGallery={handleOpenGalleryByCode}
          isIntroComplete={introCompleted}
        />
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
