import React from 'react';
import { ProjectGallery, GalleryImage } from '../../types/portfolio';
import { EditorialImageItem } from './EditorialImageItem';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProjectEditorialSpreadProps {
  project: ProjectGallery;
  onSelectImage: (image: GalleryImage) => void;
  onNavigateProject: (slug: string) => void;
  onNavigateHome: () => void;
}

export const ProjectEditorialSpread: React.FC<ProjectEditorialSpreadProps> = ({
  project,
  onSelectImage,
  onNavigateProject,
  onNavigateHome,
}) => {
  const images = project.images;
  const leadImage = images[0];
  const secondaryImage = images[1];
  const wideImage = images.find((img) => img.layoutRole === 'wide-spread') || images[2];
  const remainingImages = images.filter(
    (img) => img.id !== leadImage?.id && img.id !== secondaryImage?.id && img.id !== wideImage?.id
  );

  return (
    <article
      id={`project-spread-${project.code}`}
      className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pt-20 sm:pt-28 md:pt-32 pb-20 sm:pb-32 select-none"
    >
      {/* ============================================================
          SECTION 1: THE OPENING COMPOSITION (NO CONVENTIONAL HERO)
          Begins directly with dominant photography & integrated statement
         ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-16 sm:mb-24 md:mb-32">
        {/* Dominant Primary Photograph */}
        {leadImage && (
          <div className="lg:col-span-7 xl:col-span-7">
            <EditorialImageItem
              image={leadImage}
              priority={true}
              className="w-full aspect-[3/4] sm:aspect-[4/5]"
              onSelectImage={onSelectImage}
            />
          </div>
        )}

        {/* Integrated Editorial Statement & Project Identity */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-10 lg:pt-2">
          {/* Metadata Bar */}
          <div className="space-y-2 border-b border-[#111111]/10 dark:border-[#FEFDF3]/10 pb-4 sm:pb-6 font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.22em] uppercase opacity-75">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold">Project {project.code}</span>
              <span className="opacity-40">/</span>
              <span>{project.year}</span>
              <span className="opacity-40">/</span>
              <span>{project.location}</span>
            </div>
            <div className="opacity-60 text-[9px] sm:text-[10px]">{project.category}</div>
          </div>

          {/* Project Title & Main Bold Serif Concept Statement */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="font-editorial-serif font-normal clamp-project-title tracking-tight leading-[1.02]">
              {project.title}
            </h1>
            <p className="font-editorial-serif italic clamp-statement leading-relaxed opacity-90 text-inherit pt-1">
              {project.statement}
            </p>
          </div>

          {/* Concept Narrative Paragraph */}
          <div className="font-editorial-sans text-xs sm:text-sm tracking-wide opacity-75 leading-relaxed max-w-lg">
            <p>{project.description}</p>
          </div>

          {/* Metadata Specifications Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[#111111]/10 dark:border-[#FEFDF3]/10 font-editorial-sans text-[9px] sm:text-[10px] tracking-[0.18em] uppercase opacity-70">
            {project.client && (
              <div>
                <span className="block opacity-50 text-[8px]">Client</span>
                <span className="font-medium">{project.client}</span>
              </div>
            )}
            {project.creativeDirection && (
              <div>
                <span className="block opacity-50 text-[8px]">Creative Direction</span>
                <span className="font-medium">{project.creativeDirection}</span>
              </div>
            )}
            {project.styling && (
              <div>
                <span className="block opacity-50 text-[8px]">Styling</span>
                <span className="font-medium">{project.styling}</span>
              </div>
            )}
            <div>
              <span className="block opacity-50 text-[8px]">Curated Frames</span>
              <span className="font-medium">{project.images.length} Plates in Archive</span>
            </div>
          </div>

          {/* Secondary Supporting Image nestled in right column on large screens */}
          {secondaryImage && (
            <div className="pt-4 hidden lg:block">
              <EditorialImageItem
                image={secondaryImage}
                className="w-full aspect-[4/5]"
                onSelectImage={onSelectImage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Secondary image for mobile/tablet when hidden on small screens */}
      {secondaryImage && (
        <div className="block lg:hidden mb-16 sm:mb-24">
          <EditorialImageItem
            image={secondaryImage}
            className="w-full aspect-[4/5] max-w-xl mx-auto"
            onSelectImage={onSelectImage}
          />
        </div>
      )}

      {/* ============================================================
          SECTION 2: WIDE PANORAMIC / ARCHITECTURAL SPREAD
         ============================================================ */}
      {wideImage && (
        <div className="my-16 sm:my-28 md:my-36">
          <div className="max-w-6xl mx-auto">
            <EditorialImageItem
              image={wideImage}
              className="w-full aspect-[16/10] sm:aspect-[16/9]"
              onSelectImage={onSelectImage}
            />
          </div>
        </div>
      )}

      {/* ============================================================
          SECTION 3: ASYMMETRICAL OFFSET CLUSTER (PLATES 4, 5, 6)
         ============================================================ */}
      {remainingImages.length > 0 && (
        <div className="my-16 sm:my-28 md:my-36">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* First remaining image */}
            {remainingImages[0] && (
              <div className="lg:col-span-5 lg:translate-y-6">
                <EditorialImageItem
                  image={remainingImages[0]}
                  className="w-full aspect-[3/4]"
                  onSelectImage={onSelectImage}
                />
              </div>
            )}

            {/* Middle Quote / Tension Spacer */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center text-center font-editorial-sans text-[9px] tracking-[0.28em] uppercase opacity-40 py-8">
              <span className="w-px h-12 bg-current mb-3"></span>
              <span>Plate Series</span>
              <span className="w-px h-12 bg-current mt-3"></span>
            </div>

            {/* Second remaining image */}
            {remainingImages[1] && (
              <div className="lg:col-span-5 lg:-translate-y-6">
                <EditorialImageItem
                  image={remainingImages[1]}
                  className="w-full aspect-[4/5]"
                  onSelectImage={onSelectImage}
                />
              </div>
            )}
          </div>

          {/* Third remaining image if available */}
          {remainingImages[2] && (
            <div className="mt-12 sm:mt-20 max-w-3xl mx-auto">
              <EditorialImageItem
                image={remainingImages[2]}
                className="w-full aspect-[4/3] sm:aspect-[16/10]"
                onSelectImage={onSelectImage}
              />
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          SECTION 4: EDITORIAL PROJECT NAVIGATION & CONCLUSION
         ============================================================ */}
      <footer
        id="gallery-footer-nav"
        className="mt-20 sm:mt-32 pt-8 sm:pt-10 border-t border-[#111111]/15 dark:border-[#FEFDF3]/15 font-editorial-sans"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
          {/* Back to Home */}
          <button
            id="btn-footer-home"
            onClick={onNavigateHome}
            className="group flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer border-b border-transparent hover:border-current pb-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Return to Canvas</span>
          </button>

          {/* Next Project Link */}
          {project.nextProjectSlug && (
            <button
              id="btn-footer-next-project"
              onClick={() => onNavigateProject(project.nextProjectSlug!)}
              className="group flex items-center space-x-2 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase opacity-80 hover:opacity-100 transition-opacity cursor-pointer border-b border-current pb-0.5"
            >
              <span>Next Project</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        <div className="mt-8 text-center text-[8px] sm:text-[9px] tracking-[0.24em] uppercase opacity-40">
          Good Akingbade — All Works Protected Under Copyright 2024–2026
        </div>
      </footer>
    </article>
  );
};
