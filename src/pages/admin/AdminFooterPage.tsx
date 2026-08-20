import React, { useState, useEffect } from 'react';
import { FileText, Save, Loader2, CheckCircle2, AlertCircle, Globe, Copyright } from 'lucide-react';
import { FooterSettings } from '../../types/admin';
import { adminApiService } from '../../services/adminApiService';

export const AdminFooterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const [copyrightText, setCopyrightText] = useState('Flames Photography © 2026');
  const [designerLabel, setDesignerLabel] = useState('Designed by');
  const [designerName, setDesignerName] = useState('Castel Studios');
  const [designerUrl, setDesignerUrl] = useState('https://castelstudios.com');

  const fetchFooterData = async () => {
    setIsLoading(true);
    try {
      const footer = await adminApiService.getFooter();
      if (footer) {
        setCopyrightText(footer.copyright_text || 'Flames Photography © 2026');
        setDesignerLabel(footer.designer_label || 'Designed by');
        setDesignerName(footer.designer_name || 'Castel Studios');
        setDesignerUrl(footer.designer_url || 'https://castelstudios.com');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load footer settings' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await adminApiService.updateFooter({
        copyright_text: copyrightText.trim(),
        designer_label: designerLabel.trim(),
        designer_name: designerName.trim(),
        designer_url: designerUrl.trim(),
      });

      setFeedback({ type: 'success', message: 'Footer credits updated successfully' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save footer settings' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-sm font-mono text-neutral-400">Loading footer configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl">
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

      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">Footer Legal & Studio Credit</h3>
              <p className="text-xs text-neutral-400">
                Configure bottom copyright notice, design credit agency name and hyperlink.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAVE FOOTER
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Copyright text */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Copyright Notice Text
            </label>
            <div className="relative">
              <Copyright className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="Flames Photography © 2026"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Designer Label */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Designer Attribution Prefix
              </label>
              <input
                type="text"
                value={designerLabel}
                onChange={(e) => setDesignerLabel(e.target.value)}
                placeholder="Designed by"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Designer Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                Designer / Agency Name
              </label>
              <input
                type="text"
                value={designerName}
                onChange={(e) => setDesignerName(e.target.value)}
                placeholder="Castel Studios"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono font-bold"
              />
            </div>
          </div>

          {/* Designer URL */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
              Designer Website URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="url"
                value={designerUrl}
                onChange={(e) => setDesignerUrl(e.target.value)}
                placeholder="https://castelstudios.com"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>
        </form>
      </section>

      {/* Live Preview Box */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-3">
          Footer Preview (as rendered on website):
        </div>
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <span>{copyrightText}</span>
          <span>
            {designerLabel}{' '}
            <a
              href={designerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-200 underline hover:text-white"
            >
              {designerName}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
