import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Tag,
  BookOpen,
  Image as ImageIcon,
  Edit3,
  Layers,
  Settings as SettingsIcon,
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
  const [categories, setCategories] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('');
  const [newProjectYear, setNewProjectYear] = useState('2025');
  const [newProjectSubtext, setNewProjectSubtext] = useState('');

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Form Fields for Active Project
  const [name, setName] = useState('');
  const [subtext, setSubtext] = useState('');
  const [year, setYear] = useState('2025');
  const [category, setCategory] = useState('FASHION');
  const [story, setStory] = useState('');

  // Project Modal / Overlay Text Customization
  const [modalSubtitle, setModalSubtitle] = useState('Selected Body of Work');
  const [modalTitle, setModalTitle] = useState('Projects & Art Direction');
  const [modalArchiveLabel, setModalArchiveLabel] = useState('Good Akinbade Studio Archive');

  const fetchAllProjects = async (keepSelectedId?: number) => {
    setIsLoading(true);
    try {
      const [allProjects, allCategories, siteSettings] = await Promise.all([
        adminApiService.getProjects(),
        adminApiService.getCategories().catch(() => []),
        adminApiService.getSiteSettings().catch(() => ({})),
      ]);

      setProjects(allProjects);
      setCategories(allCategories);

      if (siteSettings) {
        if (siteSettings.projects_modal_subtitle) setModalSubtitle(siteSettings.projects_modal_subtitle);
        if (siteSettings.projects_modal_title) setModalTitle(siteSettings.projects_modal_title);
        if (siteSettings.projects_modal_archive_label) setModalArchiveLabel(siteSettings.projects_modal_archive_label);
      }

      if (allProjects.length > 0) {
        const targetId = keepSelectedId && allProjects.some((p) => p.id === keepSelectedId)
          ? keepSelectedId
          : allProjects[0].id;
        setSelectedProjectId(targetId);
        await loadProjectDetails(targetId);
      } else {
        setCurrentProject(null);
        setGalleryImages([]);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to fetch projects data' });
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setFeedback({ type: 'error', message: 'Project title is required' });
      return;
    }

    setIsCreatingProject(true);
    try {
      const created = await adminApiService.createProject({
        name: newProjectName.trim(),
        category: newProjectCategory || (categories[0]?.name || 'FASHION'),
        year: newProjectYear.trim() || '2025',
        subtext: newProjectSubtext.trim(),
        story: '',
      });

      setShowAddProjectModal(false);
      setNewProjectName('');
      setNewProjectSubtext('');
      setNewProjectYear('2025');

      setFeedback({ type: 'success', message: `Project "${created.name}" created successfully` });
      await fetchAllProjects(created.id);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to create project' });
    } finally {
      setIsCreatingProject(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDeleteCurrentProject = async () => {
    if (!currentProject) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete Project #${currentProject.id} ("${currentProject.name}")? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await adminApiService.deleteProject(currentProject.id);
      setFeedback({ type: 'success', message: `Project "${currentProject.name}" deleted` });
      await fetchAllProjects();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete project' });
    }
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
      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProjectId ? { ...p, name: updated.name, category: updated.category, year: updated.year } : p))
      );
      setFeedback({ type: 'success', message: `Project "${updated.name}" updated successfully` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save project' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleSaveOverlaySettings = async () => {
    setIsSavingSettings(true);
    try {
      await adminApiService.updateSiteSettings({
        projects_modal_subtitle: modalSubtitle.trim(),
        projects_modal_title: modalTitle.trim(),
        projects_modal_archive_label: modalArchiveLabel.trim(),
      });
      setFeedback({ type: 'success', message: 'Project overlay and archive headers saved' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save overlay headers' });
    } finally {
      setIsSavingSettings(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Category Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const created = await adminApiService.createCategory({ name: newCategoryName.trim().toUpperCase() });
      setCategories((prev) => [...prev, created]);
      setNewCategoryName('');
      setFeedback({ type: 'success', message: `Category "${created.name}" created` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to create category' });
    }
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editingCategoryName.trim()) return;
    try {
      const updated = await adminApiService.updateCategory(id, { name: editingCategoryName.trim().toUpperCase() });
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setFeedback({ type: 'success', message: `Category updated to "${updated.name}"` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to update category' });
    }
  };

  const handleDeleteCategory = async (id: number, catName: string) => {
    const confirmed = window.confirm(`Delete category "${catName}"?`);
    if (!confirmed) return;

    try {
      await adminApiService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setFeedback({ type: 'success', message: `Category "${catName}" deleted` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete category' });
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
        <p className="text-sm font-mono text-neutral-400">Loading project archives and categories...</p>
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

      {/* TOP ACTION BAR: PROJECT SELECTOR & ADD PROJECT BUTTON */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              Published Project Archives ({projects.length})
            </span>
            <h2 className="text-base font-semibold text-neutral-100 font-serif">
              Select or Create Photographic Series
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowCategoryManager((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-xl border border-neutral-700 transition-all"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl font-mono tracking-wide transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Project</span>
            </button>
          </div>
        </div>

        {/* Category Manager Drawer */}
        {showCategoryManager && (
          <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono font-semibold uppercase text-amber-400 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Project Categories
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                Categories are selectable across projects and portfolios
              </span>
            </div>

            {/* Add Category Input */}
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name (e.g. FINE ART, LOOKBOOK, COUTURE)"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-100 uppercase font-mono focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono rounded-lg border border-neutral-700"
              >
                + Add Category
              </button>
            </form>

            {/* Category Chips List */}
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-200"
                >
                  {editingCategoryId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="bg-neutral-950 border border-amber-400 text-xs px-1.5 py-0.5 rounded uppercase text-white font-mono"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateCategory(cat.id)}
                        className="text-emerald-400 hover:text-emerald-300 text-[10px] px-1"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                        className="text-neutral-500 hover:text-neutral-400 text-[10px] px-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{cat.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setEditingCategoryName(cat.name);
                        }}
                        className="text-neutral-500 hover:text-neutral-300 p-0.5"
                        title="Edit category"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="text-red-500 hover:text-red-400 p-0.5"
                        title="Delete category"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
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
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>
                    #{proj.id}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-neutral-200 text-neutral-800' : 'bg-neutral-900 text-neutral-400'}`}>
                    {proj.images?.length || 0} pics
                  </span>
                </div>
                <span className="text-xs font-semibold tracking-tight truncate mt-1 font-serif">
                  {proj.name}
                </span>
                <span className={`text-[10px] font-mono mt-0.5 truncate ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                  {proj.category} • {proj.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CREATE PROJECT MODAL */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="border-b border-neutral-800 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                New Archive Series
              </span>
              <h3 className="text-lg font-semibold text-neutral-100 font-serif">
                Add New Photographic Project
              </h3>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Lagos Nocturnes"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newProjectCategory || (categories[0]?.name || 'FASHION')}
                    onChange={(e) => setNewProjectCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono uppercase"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="FASHION">FASHION</option>
                        <option value="EDITORIAL">EDITORIAL</option>
                        <option value="PORTRAITURE">PORTRAITURE</option>
                        <option value="DOCUMENTARY">DOCUMENTARY</option>
                        <option value="FINE ART">FINE ART</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                    Release Year
                  </label>
                  <input
                    type="text"
                    value={newProjectYear}
                    onChange={(e) => setNewProjectYear(e.target.value)}
                    placeholder="2025"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5">
                  Subtext / Editorial Synopsis
                </label>
                <input
                  type="text"
                  value={newProjectSubtext}
                  onChange={(e) => setNewProjectSubtext(e.target.value)}
                  placeholder="e.g. High-fashion visual study of form and architecture"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingProject}
                  className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold font-mono rounded-xl disabled:opacity-50"
                >
                  {isCreatingProject ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  CREATE PROJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 1: PROJECT DETAILS & NARRATIVE */}
      {currentProject && (
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-100">
                  Project #{selectedProjectId} &mdash; {name}
                </h3>
                <p className="text-xs text-neutral-400">
                  Metadata, title, category, and historical curatorial story statement.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteCurrentProject}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800 text-xs font-mono rounded-xl transition-all"
                title="Delete this project"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

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
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="FASHION">FASHION</option>
                      <option value="EDITORIAL">EDITORIAL</option>
                      <option value="PORTRAITURE">PORTRAITURE</option>
                      <option value="DOCUMENTARY">DOCUMENTARY</option>
                      <option value="FINE ART">FINE ART</option>
                    </>
                  )}
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
      )}

      {/* SECTION 2: PROJECT GALLERY IMAGES */}
      {currentProject && (
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
                  Photographs shown in the project view lightbox and horizontal gallery runway.
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
              <p className="text-[11px] text-neutral-500 font-mono mt-1">
                Note: Empty projects remain completely accessible on their public URL without broken redirects.
              </p>
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
      )}

      {/* SECTION 3: EDITABLE PROJECT MODAL & ARCHIVE TEXT HEADERS */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Home Project Overlay & Archive Headers
              </h3>
              <p className="text-xs text-neutral-400">
                Customize the modal titles and archive labels shown when visitors click &ldquo;Projects&rdquo; in navigation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveOverlaySettings}
            disabled={isSavingSettings}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
          >
            {isSavingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE ARCHIVE HEADERS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Modal Eyebrow / Subtitle
            </label>
            <input
              type="text"
              value={modalSubtitle}
              onChange={(e) => setModalSubtitle(e.target.value)}
              placeholder="Selected Body of Work"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Modal Main Title
            </label>
            <input
              type="text"
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              placeholder="Projects & Art Direction"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Bottom Archive Studio Label
            </label>
            <input
              type="text"
              value={modalArchiveLabel}
              onChange={(e) => setModalArchiveLabel(e.target.value)}
              placeholder="Good Akinbade Studio Archive"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
