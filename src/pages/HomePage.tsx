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
import { publicApiService } from '../services/publicApiService';
import { ImageAssetService } from '../services/imageAssetService';
import { X } from 'lucide-react';

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
  const [topPhotos, setTopPhotos] = useState<PhotoAsset[]>(() => ImageAssetService.getTopPhotoAssets());
  const [bottomPhotos, setBottomPhotos] = useState<PhotoAsset[]>(() => ImageAssetService.getBottomPhotoAssets());
  const [previewPhoto, setPreviewPhoto] = useState<PhotoAsset | null>(null);

  // Subscribe to live dynamic photos from CMS
  useEffect(() => {
    return publicApiService.subscribe((state) => {
      if (state.topTrackPhotos?.length > 0) setTopPhotos(state.topTrackPhotos);
      if (state.bottomTrackPhotos?.length > 0) setBottomPhotos(state.bottomTrackPhotos);
    });
  }, []);

  // Check if reduced motion is preferred
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !introCompleted) {
      onMarkIntroComplete();
    }
  }, [introCompleted, onMarkIntroComplete]);

  const handleOpenGallery = (projectIdOrCode: string) => {
    if (!projectIdOrCode || projectIdOrCode === 'null') {
      return;
    }
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
          photos={topPhotos}
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
          photos={bottomPhotos}
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

      {/* Single Photo Lightbox Preview (for unlinked photos) */}
      {previewPhoto && (
        <div
          id="photo-preview-modal"
          className="fixed inset-0 z-50 bg-[#111111]/90 flex items-center justify-center p-4 select-none backdrop-blur-sm"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-6 right-6 text-[#FEFDF3] opacity-70 hover:opacity-100 p-2 cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] p-2 bg-[#FEFDF3] dark:bg-[#181818] shadow-2xl">
            <img
              src={previewPhoto.src}
              alt={previewPhoto.title || 'Print Preview'}
              className="max-h-[75vh] w-auto object-contain mx-auto"
            />
            {previewPhoto.title && (
              <p className="mt-2 text-center font-editorial-sans text-xs tracking-widest uppercase opacity-75">
                {previewPhoto.title}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

