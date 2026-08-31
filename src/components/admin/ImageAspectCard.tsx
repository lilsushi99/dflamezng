import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Link2, ExternalLink, HardDrive, Globe, Save, Check, Loader2 } from 'lucide-react';
import { SourceType } from '../../types/admin';

interface ProjectOption {
  id: number;
  name: string;
}

interface ImageAspectCardProps {
  id: number;
  orderNumber: number;
  isFirst: boolean;
  isLast: boolean;
  src: string;
  sourceType: SourceType;
  projectId?: number | null;
  projects?: ProjectOption[];
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onSave?: () => Promise<void> | void;
  onProjectChange?: (projectId: number | null) => void;
  trackLabel?: string;
}

export const ImageAspectCard: React.FC<ImageAspectCardProps> = ({
  id,
  orderNumber,
  isFirst,
  isLast,
  src,
  sourceType,
  projectId,
  projects,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSave,
  onProjectChange,
  trackLabel,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      setIsDeleting(true);
      onDelete();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
    }
  };

  const handleIndividualSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      // Handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:border-neutral-700 transition-all flex flex-col group">
      {/* Top action header bar */}
      <div className="bg-neutral-950/80 px-3 py-2 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Order Badge */}
          <span className="bg-neutral-800 text-neutral-300 font-mono text-[11px] font-semibold px-2 py-0.5 rounded">
            #{orderNumber}
          </span>

          {/* Source Type Badge */}
          <span
            className={`flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
              sourceType === 'local'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                : 'bg-sky-950/60 text-sky-300 border border-sky-800/40'
            }`}
          >
            {sourceType === 'local' ? (
              <>
                <HardDrive className="w-3 h-3" />
                FILE
              </>
            ) : (
              <>
                <Globe className="w-3 h-3" />
                URL
              </>
            )}
          </span>

          {trackLabel && (
            <span className="text-[10px] uppercase font-mono text-neutral-400">
              {trackLabel}
            </span>
          )}
        </div>

        {/* Reorder & Save & Delete Buttons */}
        <div className="flex items-center gap-1">
          {onSave && (
            <button
              type="button"
              onClick={handleIndividualSave}
              disabled={isSaving}
              title="Save Image State"
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700'
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : saveSuccess ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  SAVED
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  SAVE
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move Earlier"
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move Later"
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Delete button with confirmation */}
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title={confirmDelete ? 'Click again to confirm delete' : 'Delete Image'}
            className={`p-1 rounded ml-1 transition-all ${
              confirmDelete
                ? 'bg-red-600 text-white font-xs font-semibold px-2'
                : 'bg-neutral-800/80 hover:bg-red-950 hover:text-red-400 text-neutral-400'
            }`}
          >
            {confirmDelete ? (
              <span className="text-[10px] tracking-tight">CONFIRM?</span>
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Image Preview Area - PRESERVING NATURAL ASPECT RATIO */}
      <div className="p-3 bg-neutral-950/40 flex items-center justify-center flex-1 min-h-[220px]">
        <img
          src={src}
          alt={`Photo #${orderNumber}`}
          loading="lazy"
          className="max-h-72 w-auto max-w-full object-contain rounded border border-neutral-800/80 shadow-md transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>

      {/* Optional Project Link Dropdown (for Homepage Front/Back tracks) */}
      {projects && onProjectChange && (
        <div className="bg-neutral-950/90 p-3 border-t border-neutral-800/80">
          <label className="block text-[10px] uppercase tracking-wider font-mono text-neutral-400 mb-1 flex items-center gap-1">
            <Link2 className="w-3 h-3 text-amber-400" />
            Link to Project:
          </label>
          <select
            value={projectId ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              onProjectChange(val ? Number(val) : null);
            }}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
          >
            <option value="">(No Linked Project / Standalone Photo)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                Project {p.id}: {p.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
