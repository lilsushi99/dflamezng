import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Calendar,
  Tag,
  BookOpen,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { Project, ProjectImage } from '../../types/admin';
import { adminApiService } from '../../services/adminApiService';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';
import { ImageAspectCard } from '../../components/admin/ImageAspectCard';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Form Fields
  const [name, setName] = useState('');
  const [subtext, setSubtext] = useState('');
  const [year, setYear] = useState('2025');
  const [category, setCategory] = useState('FASHION');
  const [story, setStory] = useState('');

  const fetchAllProjects = async () => {
    setIsLoading(true);
    try {
      const all = await adminApiService.getProjects();
      setProjects(all);
      if (all.length > 0) {
        const targetId = selectedProjectId || all[0].id;
        setSelectedProjectId(targetId);
        loadProjectDetails(targetId);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to fetch projects' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectDetails = async (id: number) => {
    try {
      const proj = await adminApiService.getProject(id);
      setCurrentProject(proj);
      setName(proj.name || '');
      setSubtext(proj.subtext || '');
      setYear(proj.year || '2025');
      setCategory(proj.category || 'FASHION');
      setStory(proj.story || '');
      setGalleryImages(proj.images || []);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load project details' });
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const handleSelectProject = (id: number) => {
    setSelectedProjectId(id);
    loadProjectDetails(id);
    setFeedback(null);
  };

  const handleSaveProjectDetails = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Project name is required' });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await adminApiService.updateProject(selectedProjectId, {
        name: name.trim(),
        subtext: subtext.trim(),
        year: year.trim(),
        category: category.trim().toUpperCase(),
        story: story.trim(),
      });

      setCurrentProject(updated);
      setProjects((prev) => prev.map((p) => (p.id === selectedProjectId ? { ...p, name: updated.name } : p)));
      setFeedback({ type: 'success', message: `Project "${updated.name}" updated successfully` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save project' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Image Upload Handlers
  const handleUploadFile = async (file: File) => {
    const newImg = await adminApiService.uploadProjectImage(selectedProjectId, file);
    setGalleryImages((prev) => [...prev, newImg]);
  };

  const handleAddUrl = async (url: string) => {
    const newImg = await adminApiService.addProjectImageUrl(selectedProjectId, url);
    setGalleryImages((prev) => [...prev, newImg]);
  };

  const handleMoveImage = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const updated = [...galleryImages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((img, idx) => ({ ...img, display_order: idx + 1 }));
    setGalleryImages(reordered);

    try {
      await adminApiService.reorderProjectImages(
        selectedProjectId,
        reordered.map((img) => img.id)
      );
    } catch {
      loadProjectDetails(selectedProjectId);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await adminApiService.deleteProjectImage(imageId);
      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
      setFeedback({ type: 'success', message: 'Gallery photo deleted' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete gallery photo' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-sm font-mono text-neutral-400">Loading project archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-mono tracking-wide animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border-red-800 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* PROJECT SELECTOR TABS */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 px-3 py-1.5 mb-1">
          Select Project Archive to Edit:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {projects.map((proj) => {
            const isSelected = proj.id === selectedProjectId;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => handleSelectProject(proj.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-neutral-100 text-neutral-950 border-white shadow-md'
                    : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>
                  Project #{proj.id}
                </span>
                <span className="text-xs font-semibold tracking-tight truncate mt-0.5 font-serif">
                  {proj.name}
                </span>
                <span className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                  {proj.category} • {proj.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: PROJECT DETAILS */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Project #{selectedProjectId} Details & Narrative
              </h3>
              <p className="text-xs text-neutral-400">
                Edit title, metadata, category, and historical curatorial story.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveProjectDetails()}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE PROJECT DETAILS
          </button>
        </div>

        <form onSubmit={handleSaveProjectDetails} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project Name */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Project Name / Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Silhouettes of Eko"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Year of Release
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subtext */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Project Subtext
              </label>
              <input
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                placeholder="e.g. High-fashion editorial across contemporary Lagos landscapes"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono uppercase"
              >
                <option value="FASHION">FASHION</option>
                <option value="EDITORIAL">EDITORIAL</option>
                <option value="PORTRAITURE">PORTRAITURE</option>
                <option value="DOCUMENTARY">DOCUMENTARY</option>
                <option value="FINE ART">FINE ART</option>
                <option value="ARCHIVAL">ARCHIVAL</option>
              </select>
            </div>
          </div>

          {/* Story */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Curatorial Story & Statement
            </label>
            <textarea
              rows={4}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Describe the conceptual background, subject matter, lighting, and locations..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif resize-y"
            />
          </div>
        </form>
      </section>

      {/* SECTION 2: PROJECT GALLERY IMAGES */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Gallery Archives for &ldquo;{name}&rdquo; ({galleryImages.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Photos showcased in the project view lightbox and high-resolution gallery grid.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
            NATURAL RATIOS PRESERVED
          </div>
        </div>

        {/* Dual Upload Mode */}
        <ImageUploadDropzone
          onUploadFile={handleUploadFile}
          onAddUrl={handleAddUrl}
          helperText={`Upload high-res gallery photo for "${name}". Natural vertical and horizontal orientations preserved.`}
        />

        {galleryImages.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
            <p className="text-xs text-neutral-400">No gallery images uploaded for this project yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryImages.map((img, index) => {
              const src = img.source_type === 'local' && img.file_path ? img.file_path : (img.external_url || '');
              return (
                <ImageAspectCard
                  key={img.id}
                  id={img.id}
                  orderNumber={index + 1}
                  isFirst={index === 0}
                  isLast={index === galleryImages.length - 1}
                  src={src}
                  sourceType={img.source_type}
                  trackLabel={`PROJECT #${selectedProjectId}`}
                  onMoveUp={() => handleMoveImage(index, 'up')}
                  onMoveDown={() => handleMoveImage(index, 'down')}
                  onDelete={() => handleDeleteImage(img.id)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
