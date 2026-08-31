import React, { useState, useEffect } from 'react';
import {
  Image,
  Type,
  Upload,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { adminApiService } from '../../services/adminApiService';

interface LogoManagerProps {
  initialLogoType?: 'TEXT' | 'IMAGE';
  initialLogoText?: string;
  initialLogoImagePath?: string | null;
  onSaved?: () => void;
}

export const LogoManager: React.FC<LogoManagerProps> = ({
  initialLogoType = 'TEXT',
  initialLogoText = '',
  initialLogoImagePath = null,
  onSaved,
}) => {
  const [logoType, setLogoType] = useState<'TEXT' | 'IMAGE'>(initialLogoType);
  const [logoText, setLogoText] = useState(initialLogoText);
  const [logoImagePath, setLogoImagePath] = useState<string | null>(initialLogoImagePath);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setLogoType(initialLogoType);
    setLogoText(initialLogoText);
    setLogoImagePath(initialLogoImagePath);
  }, [initialLogoType, initialLogoText, initialLogoImagePath]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);
    try {
      const res = await adminApiService.uploadLogo(file);
      setLogoImagePath(res.logo_image_path);
      setLogoType('IMAGE');
      setFeedback({ type: 'success', message: 'Logo graphic uploaded successfully' });
      if (onSaved) onSaved();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to upload logo image' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImageLogo = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await adminApiService.deleteLogo();
      setLogoImagePath(null);
      setLogoType('TEXT');
      setFeedback({ type: 'success', message: 'Custom logo image removed, reverted to typography' });
      if (onSaved) onSaved();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to remove logo image' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMode = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await adminApiService.updateHomeSettings({
        logo_type: logoType,
        navbar_logo_text: logoText.trim(),
      });
      setFeedback({ type: 'success', message: 'Brand identity configuration published' });
      if (onSaved) onSaved();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save logo mode' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  return (
    <div id="admin-logo-manager" className="space-y-6">
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-mono tracking-wide ${
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

      {/* Mode Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setLogoType('TEXT')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            logoType === 'TEXT'
              ? 'bg-neutral-800/90 border-amber-400 shadow-md ring-1 ring-amber-400/40'
              : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Type className={`w-5 h-5 ${logoType === 'TEXT' ? 'text-amber-400' : 'text-neutral-500'}`} />
            <span className="text-sm font-semibold text-neutral-200">Typography Brandmark</span>
          </div>
          <p className="text-xs text-neutral-400">
            Renders the photographer name in the signature Editorial Serif masthead typography.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setLogoType('IMAGE')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            logoType === 'IMAGE'
              ? 'bg-neutral-800/90 border-amber-400 shadow-md ring-1 ring-amber-400/40'
              : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Image className={`w-5 h-5 ${logoType === 'IMAGE' ? 'text-amber-400' : 'text-neutral-500'}`} />
            <span className="text-sm font-semibold text-neutral-200">Custom Image Logo (SVG / PNG)</span>
          </div>
          <p className="text-xs text-neutral-400">
            Upload custom vector or transparent PNG insignia to display across the header.
          </p>
        </button>
      </div>

      {/* Mode Details */}
      {logoType === 'TEXT' ? (
        <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
            Navbar Display Text
          </label>
          <input
            type="text"
            value={logoText}
            onChange={(e) => setLogoText(e.target.value)}
            placeholder="e.g. Gold Akingbade"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
          />
          <div className="p-4 bg-[#FEFDF3] dark:bg-[#111111] border border-neutral-700 rounded-lg flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-500">Live Header Preview:</span>
            <span className="font-editorial-serif text-lg tracking-tight text-[#111111] dark:text-[#FEFDF3]">
              {logoText || 'Photographer Signature'}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300 block">
                Logo Graphic Asset
              </span>
              <span className="text-[11px] text-neutral-500">
                Recommended: Transparent PNG, WebP or SVG format with high contrast.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-mono tracking-wider cursor-pointer transition-colors">
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>UPLOAD NEW LOGO</span>
                <input
                  type="file"
                  accept="image/png,image/svg+xml,image/webp,image/jpeg"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>

              {logoImagePath && (
                <button
                  type="button"
                  onClick={handleDeleteImageLogo}
                  disabled={isSaving}
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-800"
                  title="Remove Custom Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Logo Preview Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FEFDF3] border border-neutral-300 rounded-xl text-center flex flex-col items-center justify-center min-h-[100px]">
              <span className="text-[10px] font-mono text-neutral-400 mb-2 uppercase">Light Canvas Preview</span>
              {logoImagePath ? (
                <img src={logoImagePath} alt="Logo Light Preview" className="max-h-12 max-w-full object-contain" />
              ) : (
                <span className="text-xs text-neutral-400 font-mono">No Image Uploaded</span>
              )}
            </div>

            <div className="p-4 bg-[#111111] border border-neutral-800 rounded-xl text-center flex flex-col items-center justify-center min-h-[100px]">
              <span className="text-[10px] font-mono text-neutral-500 mb-2 uppercase">Dark Canvas Preview</span>
              {logoImagePath ? (
                <img src={logoImagePath} alt="Logo Dark Preview" className="max-h-12 max-w-full object-contain" />
              ) : (
                <span className="text-xs text-neutral-600 font-mono">No Image Uploaded</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSaveMode}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          SAVE BRAND LOGO
        </button>
      </div>
    </div>
  );
};
