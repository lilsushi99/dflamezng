import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Compass,
  Share2,
  Plus,
  Trash2,
  Edit2,
  Layers,
  UploadCloud,
  Image as ImageIcon,
  Type,
  Sun,
  Moon,
} from 'lucide-react';
import { HomepageImage, SocialLink } from '../../types/admin';
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../services/adminApiService';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';
import { ImageAspectCard } from '../../components/admin/ImageAspectCard';

export const AdminHomePage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Section A: Navbar & Theme
  const [logoType, setLogoType] = useState<'TEXT' | 'IMAGE'>('TEXT');
  const [navbarLogoText, setNavbarLogoText] = useState('Gold Akinbade');
  const [logoImagePath, setLogoImagePath] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);
  const [navbarProjectsLabel, setNavbarProjectsLabel] = useState('PROJECTS');
  const [navbarContactLabel, setNavbarContactLabel] = useState('CONTACT');
  const [themeToggleVisible, setThemeToggleVisible] = useState(true);
  const [themeMode, setThemeMode] = useState<'LIGHT' | 'DARK'>('LIGHT');
  const [isSavingNavbar, setIsSavingNavbar] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Section B: Front Track
  const [frontImages, setFrontImages] = useState<HomepageImage[]>([]);
  const [isSavingFrontTrack, setIsSavingFrontTrack] = useState(false);

  // Section C: Creative Identity & Social Links
  const [photographerName, setPhotographerName] = useState('Gold Akinbade');
  const [heroSubtext, setHeroSubtext] = useState('Fashion Photographer & Art Director');
  const [mainTextCase, setMainTextCase] = useState<'as_written' | 'sentence' | 'upper' | 'lower'>('as_written');
  const [subtextCase, setSubtextCase] = useState<'as_written' | 'sentence' | 'upper' | 'lower'>('as_written');
  const [isSavingIdentity, setIsSavingIdentity] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialKey, setNewSocialKey] = useState('instagram');
  const [editingSocialId, setEditingSocialId] = useState<number | null>(null);
  const [editSocialLabel, setEditSocialLabel] = useState('');
  const [editSocialUrl, setEditSocialUrl] = useState('');
  const [editSocialKey, setEditSocialKey] = useState('instagram');
  const [isSavingSocialEdit, setIsSavingSocialEdit] = useState(false);
  const [isAddingSocial, setIsAddingSocial] = useState(false);

  // Section D: Back Track
  const [backImages, setBackImages] = useState<HomepageImage[]>([]);
  const [isSavingBackTrack, setIsSavingBackTrack] = useState(false);

  // Shared project list
  const [projectsList, setProjectsList] = useState<{ id: number; name: string }[]>([]);

  const fetchHomeData = async () => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getHomeData();
      if (data.settings) {
        const s = data.settings;
        setLogoType(s.logo_type === 'IMAGE' ? 'IMAGE' : 'TEXT');
        setNavbarLogoText(s.navbar_logo_text || 'Gold Akinbade');
        setLogoImagePath(s.logo_image_path || null);
        setNavbarProjectsLabel(s.navbar_projects_label || 'PROJECTS');
        setNavbarContactLabel(s.navbar_contact_label || 'CONTACT');
        setThemeToggleVisible(s.theme_toggle_visible !== false);
        setThemeMode(s.theme_mode === 'DARK' ? 'DARK' : 'LIGHT');
        setPhotographerName(s.photographer_name || 'Gold Akinbade');
        setHeroSubtext(s.hero_subtext || 'Fashion Photographer & Art Director');
        setMainTextCase((s.main_text_case as any) || 'as_written');
        setSubtextCase((s.subtext_case as any) || 'as_written');
      }
      setFrontImages(data.frontImages || []);
      setBackImages(data.backImages || []);
      setSocialLinks(data.socialLinks || []);
      setProjectsList(data.projects || []);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load home screen configuration' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  // ==========================================
  // SECTION A: NAVBAR HANDLERS
  // ==========================================
  const handleSaveNavbar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingNavbar(true);

    try {
      await adminApiService.updateHomeSettings({
        logo_type: logoType,
        navbar_logo_text: navbarLogoText.trim(),
        logo_image_path: logoImagePath,
        navbar_projects_label: navbarProjectsLabel.trim(),
        navbar_contact_label: navbarContactLabel.trim(),
        theme_toggle_visible: themeToggleVisible,
        theme_mode: themeMode,
      });

      showToast('success', 'Top navigation bar settings saved successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save navbar settings');
    } finally {
      setIsSavingNavbar(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const res = await adminApiService.uploadLogo(file);
      setLogoImagePath(res.logo_image_path);
      setLogoType('IMAGE');
      showToast('success', 'Logo graphic uploaded successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to upload logo image');
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleDeleteLogo = async () => {
    setIsDeletingLogo(true);
    try {
      await adminApiService.deleteLogo();
      setLogoImagePath(null);
      setLogoType('TEXT');
      showToast('success', 'Custom logo graphic removed, reverted to text logo');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to delete logo graphic');
    } finally {
      setIsDeletingLogo(false);
    }
  };

  const handleSelectThemeMode = (mode: 'LIGHT' | 'DARK') => {
    setThemeMode(mode);
    setTheme(mode.toLowerCase() as 'light' | 'dark');
  };

  // ==========================================
  // SECTION B: FRONT TRACK HANDLERS
  // ==========================================
  const handleUploadFrontFile = async (file: File) => {
    try {
      const newImg = await adminApiService.uploadHomepageImage(file, 'FRONT');
      setFrontImages((prev) => [...prev, newImg]);
      showToast('success', 'Front track image uploaded successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to upload front track image');
    }
  };

  const handleAddFrontUrl = async (url: string) => {
    try {
      const newImg = await adminApiService.addHomepageImageUrl(url, 'FRONT');
      setFrontImages((prev) => [...prev, newImg]);
      showToast('success', 'Front track image URL added');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to add image URL');
    }
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
      showToast('success', 'Front track photograph removed');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to delete front image');
    }
  };

  const handleProjectLinkChangeFront = async (imageId: number, projectId: number | null) => {
    try {
      const updated = await adminApiService.updateHomepageImage(imageId, { project_id: projectId });
      setFrontImages((prev) => prev.map((img) => (img.id === imageId ? updated : img)));
      showToast('success', 'Linked project updated for image');
    } catch (err: any) {
      showToast('error', 'Failed to link project to front image');
    }
  };

  const handleSaveFrontTrack = async () => {
    setIsSavingFrontTrack(true);
    try {
      if (frontImages.length > 0) {
        await adminApiService.reorderHomepageImages('FRONT', frontImages.map((img) => img.id));
      }
      showToast('success', 'Front track saved successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save front track');
    } finally {
      setIsSavingFrontTrack(false);
    }
  };

  // ==========================================
  // SECTION C: CREATIVE IDENTITY & SOCIAL HANDLERS
  // ==========================================
  const handleSaveIdentity = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingIdentity(true);

    try {
      await adminApiService.updateHomeSettings({
        photographer_name: photographerName.trim(),
        hero_subtext: heroSubtext.trim(),
        main_text_case: mainTextCase,
        subtext_case: subtextCase,
      });

      showToast('success', 'Creative identity and professional subtext saved successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save creative identity');
    } finally {
      setIsSavingIdentity(false);
    }
  };

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
      showToast('success', `Added social handle for ${created.label}`);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to add social link');
    } finally {
      setIsAddingSocial(false);
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    try {
      await adminApiService.deleteSocialLink(id);
      setSocialLinks((prev) => prev.filter((link) => link.id !== id));
      showToast('success', 'Social handle removed');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to delete social link');
    }
  };

  const handleStartEditSocialLink = (link: SocialLink) => {
    setEditingSocialId(link.id);
    setEditSocialLabel(link.label);
    setEditSocialUrl(link.url);
    setEditSocialKey(link.platform_key);
  };

  const handleCancelEditSocialLink = () => {
    setEditingSocialId(null);
    setEditSocialLabel('');
    setEditSocialUrl('');
  };

  const handleSaveEditSocialLink = async (id: number) => {
    if (!editSocialLabel.trim() || !editSocialUrl.trim()) return;
    setIsSavingSocialEdit(true);
    try {
      const updated = await adminApiService.updateSocialLink(id, {
        platform_key: editSocialKey,
        label: editSocialLabel.trim(),
        url: editSocialUrl.trim(),
      });
      setSocialLinks((prev) => prev.map((link) => (link.id === id ? updated : link)));
      showToast('success', `Updated social handle for ${updated.label}`);
      setEditingSocialId(null);
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to update social link');
    } finally {
      setIsSavingSocialEdit(false);
    }
  };

  const handleToggleSocialActive = async (id: number, currentActive: boolean) => {
    try {
      const updated = await adminApiService.updateSocialLink(id, { is_active: !currentActive });
      setSocialLinks((prev) => prev.map((link) => (link.id === id ? updated : link)));
    } catch (err: any) {
      showToast('error', 'Failed to update social link status');
    }
  };

  // ==========================================
  // SECTION D: BACK TRACK HANDLERS
  // ==========================================
  const handleUploadBackFile = async (file: File) => {
    try {
      const newImg = await adminApiService.uploadHomepageImage(file, 'BACK');
      setBackImages((prev) => [...prev, newImg]);
      showToast('success', 'Back track image uploaded successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to upload back track image');
    }
  };

  const handleAddBackUrl = async (url: string) => {
    try {
      const newImg = await adminApiService.addHomepageImageUrl(url, 'BACK');
      setBackImages((prev) => [...prev, newImg]);
      showToast('success', 'Back track image URL added');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to add image URL');
    }
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
      showToast('success', 'Back track photograph removed');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to delete back image');
    }
  };

  const handleProjectLinkChangeBack = async (imageId: number, projectId: number | null) => {
    try {
      const updated = await adminApiService.updateHomepageImage(imageId, { project_id: projectId });
      setBackImages((prev) => prev.map((img) => (img.id === imageId ? updated : img)));
      showToast('success', 'Linked project updated for image');
    } catch (err: any) {
      showToast('error', 'Failed to link project to back image');
    }
  };

  const handleSaveBackTrack = async () => {
    setIsSavingBackTrack(true);
    try {
      if (backImages.length > 0) {
        await adminApiService.reorderHomepageImages('BACK', backImages.map((img) => img.id));
      }
      showToast('success', 'Back Image Track saved successfully');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to save back image track');
    } finally {
      setIsSavingBackTrack(false);
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
    <div className="space-y-12 pb-16">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-mono tracking-wide animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border-red-800 text-red-300'
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
          SECTION A: NAVBAR & BRAND IDENTITY
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
                Configure brand logo (Text or Image), navigation links, and theme mode.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveNavbar()}
            disabled={isSavingNavbar}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
          >
            {isSavingNavbar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE NAVBAR
          </button>
        </div>

        {/* LOGO TYPE SELECTION */}
        <div className="mb-8 p-5 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200">Brand Logo Format</h4>
              <p className="text-[11px] text-neutral-400">
                Select whether to display typographic text or an uploaded graphic logo in the navbar.
              </p>
            </div>

            <div className="inline-flex p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
              <button
                type="button"
                onClick={() => setLogoType('TEXT')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  logoType === 'TEXT'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                Text Logo
              </button>
              <button
                type="button"
                onClick={() => setLogoType('IMAGE')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  logoType === 'IMAGE'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Image Logo
              </button>
            </div>
          </div>

          {/* Conditional Logo Input */}
          {logoType === 'TEXT' ? (
            <div className="pt-3 border-t border-neutral-800/80">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Navbar Text Logo
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input
                  type="text"
                  value={navbarLogoText}
                  onChange={(e) => setNavbarLogoText(e.target.value)}
                  placeholder="e.g. Gold Akinbade"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-neutral-900/90 border border-neutral-800 px-4 py-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Dark Preview:</span>
                    <span className="font-editorial-serif text-sm font-light text-neutral-100 tracking-tight">
                      {navbarLogoText || 'Creative Logo'}
                    </span>
                  </div>
                  <div className="flex-1 bg-neutral-100 border border-neutral-300 px-4 py-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-600 uppercase">Light Preview:</span>
                    <span className="font-editorial-serif text-sm font-light text-neutral-950 tracking-tight">
                      {navbarLogoText || 'Creative Logo'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-3 border-t border-neutral-800/80 space-y-4">
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                accept="image/png,image/svg+xml,image/webp,image/jpeg"
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                    Upload Logo Graphic (SVG, PNG, or WebP)
                  </label>
                  <p className="text-[11px] text-neutral-400">
                    Recommended: Transparent PNG or crisp vector SVG, minimum height 48px.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {isUploadingLogo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {logoImagePath ? 'Replace Logo' : 'Choose File'}
                  </button>

                  {logoImagePath && (
                    <button
                      type="button"
                      onClick={handleDeleteLogo}
                      disabled={isDeletingLogo}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {isDeletingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Preview Canvas */}
              {logoImagePath ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-500">Dark Background</span>
                    <div className="h-14 flex items-center justify-center">
                      <img
                        src={logoImagePath}
                        alt="Logo Preview Dark"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-xl flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-600">Light Background</span>
                    <div className="h-14 flex items-center justify-center">
                      <img
                        src={logoImagePath}
                        alt="Logo Preview Light"
                        className="max-h-12 max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 border border-dashed border-neutral-800 rounded-xl text-center bg-neutral-900/50">
                  <p className="text-xs text-neutral-400">No image uploaded yet. Click "Choose File" above to upload.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* LINK LABELS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Project Link Label
            </label>
            <input
              type="text"
              value={navbarProjectsLabel}
              onChange={(e) => setNavbarProjectsLabel(e.target.value)}
              placeholder="PROJECTS"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
            />
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Default: PROJECTS. Displayed in the public navbar.
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Contact Link Label
            </label>
            <input
              type="text"
              value={navbarContactLabel}
              onChange={(e) => setNavbarContactLabel(e.target.value)}
              placeholder="CONTACT"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
            />
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Default: CONTACT. Displayed in the public navbar.
            </span>
          </div>
        </div>

        {/* LIGHT / DARK MODE CONTROLS */}
        <div className="p-5 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-200">
                Default Palette Theme
              </h4>
              <p className="text-[11px] text-neutral-400">
                Choose the default visual appearance for the portfolio. Switching here updates the active canvas in real time.
              </p>
            </div>

            <div className="inline-flex p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleSelectThemeMode('LIGHT')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  themeMode === 'LIGHT'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light Mode
              </button>
              <button
                type="button"
                onClick={() => handleSelectThemeMode('DARK')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  themeMode === 'DARK'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark Mode
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-200 block">
                Visitor Light / Dark Mode Toggle
              </span>
              <span className="text-[11px] text-neutral-500 block">
                When enabled, visitors see the theme toggle switch in the navbar to alternate between Light and Dark mode.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={themeToggleVisible}
                onChange={(e) => setThemeToggleVisible(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION B: FRONT IMAGES (Foreground Track)
         ========================================== */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Section B: Front Image Track ({frontImages.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Foreground photograph track. Each image can link directly to a project archive.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
              NATURAL RATIOS PRESERVED
            </span>
            <button
              type="button"
              onClick={handleSaveFrontTrack}
              disabled={isSavingFrontTrack}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
            >
              {isSavingFrontTrack ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              SAVE FRONT TRACK
            </button>
          </div>
        </div>

        <ImageUploadDropzone
          onUploadFile={handleUploadFrontFile}
          onAddUrl={handleAddFrontUrl}
          helperText="Upload foreground track photograph (Device or URL). Original photographic aspect ratios preserved."
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
          SECTION C: CREATIVE IDENTITY & SOCIAL LINKS
         ========================================== */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Section C: Creative Identity & Social Channels
              </h3>
              <p className="text-xs text-neutral-400">
                Set primary creative name, professional subtext, and manage external social handles.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveIdentity()}
            disabled={isSavingIdentity}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
          >
            {isSavingIdentity ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE CREATIVE IDENTITY
          </button>
        </div>

        {/* Central Identity: Name & Professional Subtext */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Main Creative Name / Brand Name
            </label>
            <input
              type="text"
              value={photographerName}
              onChange={(e) => setPhotographerName(e.target.value)}
              placeholder="e.g. Gold Akinbade"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
            />
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Displayed prominently as the central masthead signature on the homepage.
            </span>
            <div className="mt-2.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                Text Case
              </label>
              <select
                value={mainTextCase}
                onChange={(e) => setMainTextCase(e.target.value as typeof mainTextCase)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 font-mono"
              >
                <option value="as_written">As Written</option>
                <option value="sentence">Sentence case</option>
                <option value="upper">UPPERCASE</option>
                <option value="lower">lowercase</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Professional Subtext
            </label>
            <input
              type="text"
              value={heroSubtext}
              onChange={(e) => setHeroSubtext(e.target.value)}
              placeholder="e.g. Fashion Photographer & Art Director"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
            />
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Professional description displayed cleanly beneath the main creative name.
            </span>
            <div className="mt-2.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                Text Case
              </label>
              <select
                value={subtextCase}
                onChange={(e) => setSubtextCase(e.target.value as typeof subtextCase)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 font-mono"
              >
                <option value="as_written">As Written</option>
                <option value="sentence">Sentence case</option>
                <option value="upper">UPPERCASE</option>
                <option value="lower">lowercase</option>
              </select>
            </div>
          </div>
        </div>

        {/* Social Links Manager */}
        <div className="border-t border-neutral-800 pt-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-300 mb-4">
            Manage Social & Portfolio Handles ({socialLinks.length})
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
                  <option value="behance">Behance</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="pexels">Pexels</option>
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
                  placeholder="e.g. INSTAGRAM or BEHANCE"
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
                  placeholder="https://..."
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
            {socialLinks.map((link) =>
              editingSocialId === link.id ? (
                <div
                  key={link.id}
                  className="p-3 bg-neutral-950 border border-amber-400/40 rounded-xl space-y-2.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <select
                      value={editSocialKey}
                      onChange={(e) => setEditSocialKey(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="pixieset">Pixieset</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="behance">Behance</option>
                      <option value="dribbble">Dribbble</option>
                      <option value="pexels">Pexels</option>
                      <option value="custom">Custom Channel</option>
                    </select>
                    <input
                      type="text"
                      value={editSocialLabel}
                      onChange={(e) => setEditSocialLabel(e.target.value)}
                      placeholder="Label"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono uppercase"
                    />
                    <input
                      type="url"
                      value={editSocialUrl}
                      onChange={(e) => setEditSocialUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleCancelEditSocialLink}
                      disabled={isSavingSocialEdit}
                      className="px-3 py-1.5 text-[11px] font-mono uppercase text-neutral-400 hover:text-neutral-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEditSocialLink(link.id)}
                      disabled={isSavingSocialEdit || !editSocialLabel.trim() || !editSocialUrl.trim()}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSavingSocialEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-neutral-100 uppercase tracking-wider shrink-0">
                      {link.label}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500 truncate max-w-xs md:max-w-md">
                      {link.url}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleSocialActive(link.id, link.is_active)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium tracking-wide transition-colors ${
                        link.is_active
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {link.is_active ? 'ACTIVE' : 'HIDDEN'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEditSocialLink(link)}
                      className="p-1.5 text-neutral-500 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors"
                      aria-label={`Edit ${link.label}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSocialLink(link.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                      aria-label={`Delete ${link.label}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION D: BACK IMAGES (Background Track)
         ========================================== */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Section D: Back Image Track ({backImages.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Background scrolling photograph track. Each image can link directly to a project archive.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
              NATURAL RATIOS PRESERVED
            </span>
            <button
              type="button"
              onClick={handleSaveBackTrack}
              disabled={isSavingBackTrack}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
            >
              {isSavingBackTrack ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              SAVE BACK TRACK
            </button>
          </div>
        </div>

        <ImageUploadDropzone
          onUploadFile={handleUploadBackFile}
          onAddUrl={handleAddBackUrl}
          helperText="Upload background track photograph (Device or URL). Original photographic aspect ratios preserved."
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
