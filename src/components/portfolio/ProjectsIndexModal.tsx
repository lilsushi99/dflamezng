import React from 'react';
import { X } from 'lucide-react';
import { ProjectGallery } from '../../types/portfolio';
import { ImageAssetService } from '../../services/imageAssetService';
import { publicApiService } from '../../services/publicApiService';

interface ProjectsIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProjectPhoto: (photo: any) => void;
}

export const ProjectsIndexModal: React.FC<ProjectsIndexModalProps> = ({
  isOpen,
  onClose,
  onSelectProjectPhoto,
}) => {
  if (!isOpen) return null;

  const projects = ImageAssetService.getAllProjects();
  const topPhotos = ImageAssetService.getTopPhotoAssets();
  const studioName = publicApiService.getState().studioName || publicApiService.getState().photographerName || 'Flames Photography';

  const handleOpenProject = (project: ProjectGallery) => {
    const matched =
      topPhotos.find((p) => p.projectId === project.id || p.projectCode === project.code) ||
      (topPhotos.length > 0 ? topPhotos[0] : { projectId: project.id, projectCode: project.code });
    onClose();
    onSelectProjectPhoto(matched);
  };

  return (
    <div
      id="projects-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/85 backdrop-blur-[2px] p-4 sm:p-6 md:p-10 transition-opacity duration-300 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="projects-modal-container"
        className="w-full max-w-4xl mx-auto my-6 sm:my-10 bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] border border-[#E2DFD2] dark:border-[#262626] p-6 sm:p-8 md:p-12 relative shadow-2xl transition-colors duration-300"
      >
        <button
          id="btn-close-projects-index"
          onClick={onClose}
          className="absolute top-6 right-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1"
          aria-label="Close projects index modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="border-b border-[#111111]/15 dark:border-[#FEFDF3]/15 pb-4 mb-8">
          <span className="font-editorial-sans text-[10px] tracking-[0.25em] uppercase opacity-60">
            Selected Body of Work
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl mt-1">
            Projects & Art Direction
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="py-12 text-center font-editorial-sans text-xs tracking-widest uppercase opacity-50">
            No projects in archive
          </div>
        ) : (
          <div className="divide-y divide-[#111111]/10 dark:divide-[#FEFDF3]/10">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer transition-opacity hover:opacity-80"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleOpenProject(project);
                  }
                }}
              >
                <div className="flex items-baseline space-x-4 sm:space-x-6">
                  <span className="font-editorial-sans text-xs sm:text-sm tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity">
                    {project.code}
                  </span>
                  <div>
                    <h3 className="font-editorial-serif text-2xl sm:text-3xl md:text-4xl group-hover:italic transition-all">
                      {project.title}
                    </h3>
                    <p className="font-editorial-sans text-[11px] tracking-wider opacity-60 mt-1 uppercase">
                      {project.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center font-editorial-sans text-[10px] tracking-[0.2em] uppercase opacity-70">
                  <span>{project.year}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#111111]/15 dark:border-[#FEFDF3]/15 flex items-center justify-between font-editorial-sans text-[10px] tracking-[0.2em] uppercase opacity-60">
          <span>{studioName} Archive</span>
          <span>{projects.length} Selected Project{projects.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
};
