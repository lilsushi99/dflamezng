import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Compass,
  Sliders,
  Share2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Layers,
  Link2,
} from 'lucide-react';
import { HomepageSettings, HomepageImage, SocialLink } from '../../types/admin';
import { adminApiService } from '../../services/adminApiService';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';
import { ImageAspectCard } from '../../components/admin/ImageAspectCard';
import { LogoManager } from '../../components/admin/LogoManager';

export const AdminHomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Settings state
  const [navbarLogoText, setNavbarLogoText] = useState('God Akinbade');
  const [navbarProjectsLabel, setNavbarProjectsLabel] = useState('PROJECTS');
  const [navbarContactLabel, setNavbarContactLabel] = useState('CONTACT');
  const [themeToggleVisible, setThemeToggleVisible] = useState(true);
  const [photographerName, setPhotographerName] = useState('Gold Akingbade');
  const [heroQuote, setHeroQuote] = useState('');
  const [heroSubtext, setHeroSubtext] = useState('');

  // Image tracks & projects
  const [frontImages, setFrontImages] = useState<HomepageImage[]>([]);
  const [backImages, setBackImages] = useState<HomepageImage[]>([]);
  const [projectsList, setProjectsList] = useState<{ id: number; name: string }[]>([]);

  // Social Links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialKey, setNewSocialKey] = useState('instagram');
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  const fetchHomeData = async () => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getHomeData();
      if (data.settings) {
        setNavbarLogoText(data.settings.navbar_logo_text || 'God Akinbade');
        setNavbarProjectsLabel(data.settings.navbar_projects_label || 'PROJECTS');
        setNavbarContactLabel(data.settings.navbar_contact_label || 'CONTACT');
        setThemeToggleVisible(data.settings.theme_toggle_visible !== false);
        setPhotographerName(data.settings.photographer_name || 'Gold Akingbade');
        setHeroQuote(data.settings.hero_quote || '');
        setHeroSubtext(data.settings.hero_subtext || '');
      }
      setFrontImages(data.frontImages || []);
      setBackImages(data.backImages || []);
      setSocialLinks(data.socialLinks || []);
      setProjectsList(data.projects || []);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load home screen data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    setFeedback(null);

    try {
      await adminApiService.updateHomeSettings({
        navbar_logo_text: navbarLogoText.trim(),
        navbar_projects_label: navbarProjectsLabel.trim(),
        navbar_contact_label: navbarContactLabel.trim(),
        theme_toggle_visible: themeToggleVisible,
        photographer_name: photographerName.trim(),
        hero_quote: heroQuote.trim(),
        hero_subtext: heroSubtext.trim(),
      });

      setFeedback({ type: 'success', message: 'Home settings & typography saved successfully' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save home settings' });
    } finally {
      setIsSavingSettings(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // ==========================================
  // FRONT IMAGES HANDLERS
  // ==========================================
  const handleUploadFrontFile = async (file: File) => {
    const newImg = await adminApiService.uploadHomepageImage(file, 'FRONT');
    setFrontImages((prev) => [...prev, newImg]);
  };

  const handleAddFrontUrl = async (url: string) => {
    const newImg = await adminApiService.addHomepageImageUrl(url, 'FRONT');
    setFrontImages((prev) => [...prev, newImg]);
  };

  const handleMoveFrontImage = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= frontImages.length) return;

    const updated = [...frontImages];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;

    const reordered = updated.map((img, idx) => ({ ...img, display_order: idx + 1 }));
    setFrontImages(reordered);

    try {
      await adminApiService.reorderHomepageImages('FRONT', reordered.map((img) => img.id));
    } catch {
      fetchHomeData();
    }
  };

  const handleDeleteFrontImage = async (id: number) => {
    try {
      await adminApiService.deleteHomepageImage(id);
      setFrontImages((prev) => prev.filter((img) => img.id !== id));
      setFeedback({ type: 'success', message: 'Front track image removed' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete image' });
    }
  };

  const handleProjectLinkChangeFront = async (imageId: number, projectId: number | null) => {
    try {
      const updated = await adminApiService.updateHomepageImage(imageId, { project_id: projectId });
      setFrontImages((prev) => prev.map((img) => (img.id === imageId ? updated : img)));
      setFeedback({ type: 'success', message: 'Linked project updated for image' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to link project to image' });
    }
  };

  // ==========================================
  // BACK IMAGES HANDLERS
  // ==========================================
  const handleUploadBackFile = async (file: File) => {
    const newImg = await adminApiService.uploadHomepageImage(file, 'BACK');
    setBackImages((prev) => [...prev, newImg]);
  };

  const handleAddBackUrl = async (url: string) => {
    const newImg = await adminApiService.addHomepageImageUrl(url, 'BACK');
    setBackImages((prev) => [...prev, newImg]);
  };

  const handleMoveBackImage = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= backImages.length) return;

    const updated = [...backImages];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;

    const reordered = updated.map((img, idx) => ({ ...img, display_order: idx + 1 }));
    setBackImages(reordered);

    try {
      await adminApiService.reorderHomepageImages('BACK', reordered.map((img) => img.id));
    } catch {
      fetchHomeData();
    }
  };

  const handleDeleteBackImage = async (id: number) => {
    try {
      await adminApiService.deleteHomepageImage(id);
      setBackImages((prev) => prev.filter((img) => img.id !== id));
      setFeedback({ type: 'success', message: 'Back track image removed' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete image' });
    }
  };

  const handleProjectLinkChangeBack = async (imageId: number, projectId: number | null) => {
    try {
      const updated = await adminApiService.updateHomepageImage(imageId, { project_id: projectId });
      setBackImages((prev) => prev.map((img) => (img.id === imageId ? updated : img)));
      setFeedback({ type: 'success', message: 'Linked project updated for image' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to link project to image' });
    }
  };

  // ==========================================
  // SOCIAL LINKS HANDLERS
  // ==========================================
  const handleAddSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialLabel.trim() || !newSocialUrl.trim()) return;

    setIsAddingSocial(true);
    try {
      const created = await adminApiService.addSocialLink({
        platform_key: newSocialKey,
        label: newSocialLabel.trim(),
        url: newSocialUrl.trim(),
        display_order: socialLinks.length + 1,
        is_active: true,
      });

      setSocialLinks((prev) => [...prev, created]);
      setNewSocialLabel('');
      setNewSocialUrl('');
      setFeedback({ type: 'success', message: `Added social link for ${created.label}` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to add social link' });
    } finally {
      setIsAddingSocial(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    try {
      await adminApiService.deleteSocialLink(id);
      setSocialLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete social link' });
    }
  };

  const handleToggleSocialActive = async (id: number, currentActive: boolean) => {
    try {
      const updated = await adminApiService.updateSocialLink(id, { is_active: !currentActive });
      setSocialLinks((prev) => prev.map((link) => (link.id === id ? updated : link)));
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to update social link status' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-sm font-mono text-neutral-400">Loading home screen configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
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

      {/* ==========================================
          SECTION A: NAVBAR CONFIGURATION
         ========================================== */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">Section A: Top Navigation Bar</h3>
              <p className="text-xs text-neutral-400">
                Configure brand mark, menu label text, and theme toggle visibility.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSettings()}
            disabled={isSavingSettings}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
          >
            {isSavingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE NAVBAR
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Logo Text */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Navbar Logo Text
            </label>
            <input
              type="text"
              value={navbarLogoText}
              onChange={(e) => setNavbarLogoText(e.target.value)}
              placeholder="God Akinbade"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
            />
          </div>

          {/* Projects Link Label */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Projects Link Label
            </label>
            <input
              type="text"
              value={navbarProjectsLabel}
              onChange={(e) => setNavbarProjectsLabel(e.target.value)}
              placeholder="PROJECTS"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Contact Link Label */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Contact Link Label
            </label>
            <input
              type="text"
              value={navbarContactLabel}
              onChange={(e) => setNavbarContactLabel(e.target.value)}
              placeholder="CONTACT"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        {/* Theme Toggle Visibility */}
        <div className="mt-6 pt-6 border-t border-neutral-800 flex items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-200 block">
              Light / Dark Theme Toggle Switch
            </span>
            <span className="text-[11px] text-neutral-500">
              When enabled, visitors can switch between Editorial Dark and Clean Light modes
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={themeToggleVisible}
              onChange={(e) => setThemeToggleVisible(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
          </label>
        </div>

        {/* Brand Logo Customization (Text vs Image Upload) */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          <LogoManager />
        </div>
      </section>

      {/* ==========================================
          SECTION B: FRONT IMAGES (Parallax Track 1)
         ========================================== */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Section B: Front Image Track ({frontImages.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Foreground scrolling photograph track. Each image can optionally link to a full project archive.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
            NATURAL RATIOS PRESERVED
          </div>
        </div>

        <ImageUploadDropzone
          onUploadFile={handleUploadFrontFile}
          onAddUrl={handleAddFrontUrl}
          helperText="Upload foreground track photograph (Device or URL). Original aspect ratios preserved."
        />

        {frontImages.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
            <p className="text-xs text-neutral-400">No front track images currently uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {frontImages.map((img, index) => {
              const src = img.source_type === 'local' && img.file_path ? img.file_path : (img.external_url || '');
              return (
                <ImageAspectCard
                  key={img.id}
                  id={img.id}
                  orderNumber={index + 1}
                  isFirst={index === 0}
                  isLast={index === frontImages.length - 1}
                  src={src}
                  sourceType={img.source_type}
                  projectId={img.project_id}
                  projects={projectsList}
                  trackLabel="FRONT TRACK"
                  onMoveUp={() => handleMoveFrontImage(index, 'up')}
                  onMoveDown={() => handleMoveFrontImage(index, 'down')}
                  onDelete={() => handleDeleteFrontImage(img.id)}
                  onProjectChange={(projId) => handleProjectLinkChangeFront(img.id, projId)}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ==========================================
          SECTION C: MAIN TEXT & SOCIAL LINKS
         ========================================== */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Section C: Main Photographer Name & Social Links
              </h3>
              <p className="text-xs text-neutral-400">
                Edit hero biographical text and configure direct portfolio & social links.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSettings()}
            disabled={isSavingSettings}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
          >
            {isSavingSettings ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE HERO TEXT
          </button>
        </div>

        {/* Hero Name & Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Main Photographer Name
            </label>
            <input
              type="text"
              value={photographerName}
              onChange={(e) => setPhotographerName(e.target.value)}
              placeholder="Gold Akingbade"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Hero Archival Subtext
            </label>
            <input
              type="text"
              value={heroSubtext}
              onChange={(e) => setHeroSubtext(e.target.value)}
              placeholder="Monochrome and pigmented archival studies across West African landscapes."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Hero Statement / Quote
            </label>
            <textarea
              rows={2}
              value={heroQuote}
              onChange={(e) => setHeroQuote(e.target.value)}
              placeholder="A study of identity, architectural movement and quiet confidence..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 resize-none font-serif italic"
            />
          </div>
        </div>

        {/* Social Links Manager */}
        <div className="border-t border-neutral-800 pt-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 mb-4">
            Manage Social & Portfolio Channels ({socialLinks.length})
          </h4>

          {/* Add Social Link Form */}
          <form onSubmit={handleAddSocialLink} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  Platform
                </label>
                <select
                  value={newSocialKey}
                  onChange={(e) => setNewSocialKey(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="pixieset">Pixieset</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="custom">Custom Channel</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  required
                  value={newSocialLabel}
                  onChange={(e) => setNewSocialLabel(e.target.value)}
                  placeholder="e.g. INSTAGRAM or PIXIESET"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  Target URL
                </label>
                <input
                  type="url"
                  required
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isAddingSocial || !newSocialLabel || !newSocialUrl}
                  className="w-full py-2 bg-neutral-100 hover:bg-white text-neutral-950 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  ADD LINK
                </button>
              </div>
            </div>
          </form>

          {/* Social Links List */}
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-neutral-100 uppercase tracking-wider">
                    {link.label}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 truncate max-w-xs md:max-w-md">
                    {link.url}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleSocialActive(link.id, link.is_active)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-medium tracking-wide transition-colors ${
                      link.is_active
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {link.is_active ? 'ACTIVE' : 'HIDDEN'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSocialLink(link.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION D: BACK IMAGES (Parallax Track 2)
         ========================================== */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Section D: Back Image Track ({backImages.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Background scrolling photograph track. Each image can optionally link to a full project archive.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
            NATURAL RATIOS PRESERVED
          </div>
        </div>

        <ImageUploadDropzone
          onUploadFile={handleUploadBackFile}
          onAddUrl={handleAddBackUrl}
          helperText="Upload background track photograph (Device or URL). Original aspect ratios preserved."
        />

        {backImages.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
            <p className="text-xs text-neutral-400">No back track images currently uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {backImages.map((img, index) => {
              const src = img.source_type === 'local' && img.file_path ? img.file_path : (img.external_url || '');
              return (
                <ImageAspectCard
                  key={img.id}
                  id={img.id}
                  orderNumber={index + 1}
                  isFirst={index === 0}
                  isLast={index === backImages.length - 1}
                  src={src}
                  sourceType={img.source_type}
                  projectId={img.project_id}
                  projects={projectsList}
                  trackLabel="BACK TRACK"
                  onMoveUp={() => handleMoveBackImage(index, 'up')}
                  onMoveDown={() => handleMoveBackImage(index, 'down')}
                  onDelete={() => handleDeleteBackImage(img.id)}
                  onProjectChange={(projId) => handleProjectLinkChangeBack(img.id, projId)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
