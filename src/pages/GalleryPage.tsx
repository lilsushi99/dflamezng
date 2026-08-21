import React, { useState, useEffect } from 'react';
import { ImageAssetService } from '../services/imageAssetService';
import { publicApiService } from '../services/publicApiService';
import { GalleryImage, ProjectGallery } from '../types/portfolio';
import { GalleryHeader } from '../components/gallery/GalleryHeader';
import { HorizontalProjectGallery } from '../components/gallery/HorizontalProjectGallery';
import { GalleryImageViewer } from '../components/gallery/GalleryImageViewer';
import { ArrowLeft } from 'lucide-react';

interface GalleryPageProps {
  projectSlug: string;
  onNavigateHome: () => void;
  onNavigateProject: (slug: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  projectSlug,
  onNavigateHome,
  onNavigateProject,
}) => {
  const [project, setProject] = useState<ProjectGallery | null>(() =>
    ImageAssetService.getProjectBySlug(projectSlug)
  );
  const [focusedImage, setFocusedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const updateProject = () => {
      const nextProject = ImageAssetService.getProjectBySlug(projectSlug);
      setProject(nextProject);
      const photographer = publicApiService.getState().photographerName || 'Flames Photography';
      if (nextProject) {
        document.title = `${nextProject.title} — ${photographer}`;
      } else {
        document.title = `Project Not Found — ${photographer}`;
      }
    };

    updateProject();
    const unsubscribe = publicApiService.subscribe(() => {
      updateProject();
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => unsubscribe();
  }, [projectSlug]);

  if (!project) {
    return (
      <main
        id="gallery-not-found"
        className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] select-none text-center"
      >
        <div className="space-y-4 max-w-md">
          <span className="font-editorial-sans text-[10px] tracking-[0.28em] uppercase opacity-50">
            Archive Reference 404
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl font-light">
            Project Not Located
          </h1>
          <p className="font-editorial-sans text-xs opacity-60 tracking-wider">
            The requested photographic series is not currently active in the studio archive.
          </p>
          <div className="pt-6">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center space-x-2 font-editorial-sans text-xs tracking-[0.22em] uppercase border-b border-current pb-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Canvas</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      id="gallery-page-container"
      className="min-h-screen w-full bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400"
    >
      {/* 1. Minimal Top Navigation Bar with Understated HOME Control */}
      <GalleryHeader
        onNavigateHome={onNavigateHome}
        projectTitle={project.title}
      />

      {/* 2. Horizontal Editorial Photographic Project Composition */}
      <HorizontalProjectGallery
        project={project}
        onSelectImage={(img) => setFocusedImage(img)}
        onNavigateProject={onNavigateProject}
        onNavigateHome={onNavigateHome}
      />

      {/* 3. Focused Single-Plate Gallery Inspector Modal */}
      <GalleryImageViewer
        image={focusedImage}
        allImages={project.images}
        projectTitle={project.title}
        onClose={() => setFocusedImage(null)}
        onSelectImage={(img) => setFocusedImage(img)}
      />
    </main>
  );
};
