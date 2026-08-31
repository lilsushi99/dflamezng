import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import { SplashSettings, SplashImage } from '../../types/admin';
import { adminApiService } from '../../services/adminApiService';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';
import { ImageAspectCard } from '../../components/admin/ImageAspectCard';

export const AdminSplashPage: React.FC = () => {
  const [settings, setSettings] = useState<SplashSettings | null>(null);
  const [images, setImages] = useState<SplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Form State
  const [photographerName, setPhotographerName] = useState('');
  const [splashSubtext, setSplashSubtext] = useState('');
  const [typewriterEnabled, setTypewriterEnabled] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(65);
  const [stackDuration, setStackDuration] = useState(3200);

  const fetchSplashData = async () => {
    setIsLoading(true);
    try {
      const data = await adminApiService.getSplash();
      setSettings(data.settings);
      setImages(data.images);

      if (data.settings) {
        setPhotographerName(data.settings.photographer_name || data.settings.signature_text || '');
        setSplashSubtext(data.settings.splash_subtext || '');
        setTypewriterEnabled(data.settings.typewriter_enabled !== false);
        setIsEnabled(data.settings.is_enabled !== false);
        setTypingSpeed(data.settings.typing_speed_ms || 65);
        setStackDuration(data.settings.stack_duration_ms || 3200);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load splash screen settings' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSplashData();
  }, []);

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const updated = await adminApiService.updateSplashSettings({
        photographer_name: photographerName.trim(),
        signature_text: photographerName.trim(),
        splash_subtext: splashSubtext.trim(),
        typewriter_enabled: typewriterEnabled,
        is_enabled: isEnabled,
        typing_speed_ms: Number(typingSpeed),
        stack_duration_ms: Number(stackDuration),
      });

      setSettings(updated);
      setFeedback({ type: 'success', message: 'Splash screen configuration saved successfully' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save splash screen settings' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleSaveSingleImage = async (id: number, index: number) => {
    try {
      await adminApiService.updateSplashImage(id, {
        display_order: index + 1,
      });
      setFeedback({ type: 'success', message: `Splash photo #${index + 1} saved successfully` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save splash photo' });
    }
  };

  const handleUploadFile = async (file: File) => {
    const newImg = await adminApiService.uploadSplashImage(file);
    setImages((prev) => [...prev, newImg]);
  };

  const handleAddUrl = async (url: string) => {
    const newImg = await adminApiService.addSplashImageUrl(url);
    setImages((prev) => [...prev, newImg]);
  };

  const handleMoveImage = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Update display_order numbers
    const reordered = updated.map((img, idx) => ({ ...img, display_order: idx + 1 }));
    setImages(reordered);

    try {
      await adminApiService.reorderSplashImages(reordered.map((img) => img.id));
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Failed to save image order' });
      fetchSplashData();
    }
  };

  const handleDeleteImage = async (id: number) => {
    try {
      await adminApiService.deleteSplashImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setFeedback({ type: 'success', message: 'Image deleted from splash stack' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete splash image' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-sm font-mono text-neutral-400">Loading splash screen configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
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

      {/* SECTION 1: SPLASH SCREEN COPY & BEHAVIOR SETTINGS */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">Splash Opening & Typography</h3>
              <p className="text-xs text-neutral-400">
                Configure opening sequence name, subtext, typewriter animation, and sequence speeds.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSettings()}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE SPLASH SETTINGS
          </button>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Photographer Signature / Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Photographer Name / Signature Text
              </label>
              <input
                type="text"
                value={photographerName}
                onChange={(e) => setPhotographerName(e.target.value)}
                placeholder="Gold Akingbade"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
              />
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Displays prominently during the initial opening screen signature sequence.
              </p>
            </div>

            {/* Splash Subtext */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Splash Subtext
              </label>
              <input
                type="text"
                value={splashSubtext}
                onChange={(e) => setSplashSubtext(e.target.value)}
                placeholder="A visual archive of contemporary Nigerian fashion and fine art photography."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-neutral-500 mt-1.5">
                Sub-headline that accompanies the opening signature typewriter.
              </p>
            </div>
          </div>

          {/* Animation Speeds Control */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-neutral-800/80">
            {/* Typewriter Speed */}
            <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Typewriter Speed
                </span>
                <span className="text-xs font-mono text-amber-300 font-semibold">{typingSpeed} ms/char</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={typingSpeed}
                onChange={(e) => setTypingSpeed(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>Fast (20ms)</span>
                <span>Default (65ms)</span>
                <span>Slow (150ms)</span>
              </div>
            </div>

            {/* Stack Duration */}
            <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Photo Stack Total Duration
                </span>
                <span className="text-xs font-mono text-amber-300 font-semibold">{stackDuration} ms</span>
              </div>
              <input
                type="range"
                min="1500"
                max="6000"
                step="100"
                value={stackDuration}
                onChange={(e) => setStackDuration(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>Brief (1.5s)</span>
                <span>Default (3.2s)</span>
                <span>Extended (6.0s)</span>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Typewriter Effect Toggle */}
            <div className="flex items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-200 block">
                  Typewriter Effect
                </span>
                <span className="text-[11px] text-neutral-500">
                  Animates the signature text character-by-character on entry
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={typewriterEnabled}
                  onChange={(e) => setTypewriterEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>

            {/* Splash Enable Toggle */}
            <div className="flex items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-200 block">
                  Show Splash Screen
                </span>
                <span className="text-[11px] text-neutral-500">
                  If turned off, visitors land directly on the homepage
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </div>
        </form>
      </section>

      {/* SECTION 2: SPLASH IMAGES STACK */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Splash Opening Photo Stack ({images.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Unlimited images supported. Save individual photos or save whole batch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSaveSettings()}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              SAVE ALL CHANGES
            </button>
            <div className="text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800 hidden sm:block">
              UNLIMITED STACK
            </div>
          </div>
        </div>

        {/* Dual Upload Mode */}
        <ImageUploadDropzone
          onUploadFile={handleUploadFile}
          onAddUrl={handleAddUrl}
          helperText="Upload photographs from device or paste HTTPS links. Portrait and landscape formats are both preserved."
        />

        {/* Image Grid with natural aspect ratios & individual Save buttons */}
        {images.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
            <Layers className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-400 font-medium">No splash images currently uploaded</p>
            <p className="text-xs text-neutral-600 mt-1">Use the upload box above to add your first photo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((img, index) => {
              const src = img.source_type === 'local' && img.file_path ? img.file_path : (img.external_url || '');
              return (
                <ImageAspectCard
                  key={img.id}
                  id={img.id}
                  orderNumber={index + 1}
                  isFirst={index === 0}
                  isLast={index === images.length - 1}
                  src={src}
                  sourceType={img.source_type}
                  onMoveUp={() => handleMoveImage(index, 'up')}
                  onMoveDown={() => handleMoveImage(index, 'down')}
                  onDelete={() => handleDeleteImage(img.id)}
                  onSave={() => handleSaveSingleImage(img.id, index)}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
