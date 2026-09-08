import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle, Eye, X, ArrowUpRight, Images } from 'lucide-react';

interface ImageUploadDropzoneProps {
  onUploadFile: (file: File) => Promise<void>;
  onAddUrl: (url: string) => Promise<void>;
  disabled?: boolean;
  helperText?: string;
  submitButtonText?: string;
}

interface StagedFileEntry {
  file: File;
  previewUrl: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  onUploadFile,
  onAddUrl,
  disabled = false,
  helperText = 'Supports JPG, PNG, WebP, AVIF up to 30MB each. Select multiple photos to upload them all at once.',
  submitButtonText = 'UPLOAD & PUBLISH',
}) => {
  const [activeTab, setActiveTab] = useState<'device' | 'url'>('device');
  const [stagedFiles, setStagedFiles] = useState<StagedFileEntry[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleStageFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    clearMessages();
    const entries: StagedFileEntry[] = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    // Append to any already-staged selection so drag/drop + browse can be combined.
    setStagedFiles((prev) => [...prev, ...entries]);
  };

  const handleRemoveStagedAt = (index: number) => {
    setStagedFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearStaged = () => {
    stagedFiles.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
    setStagedFiles([]);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmUpload = async () => {
    if (stagedFiles.length === 0) return;
    clearMessages();
    setIsUploading(true);

    const total = stagedFiles.length;
    let succeeded = 0;
    const failedNames: string[] = [];

    // Upload sequentially so display order stays predictable and the
    // existing single-file backend endpoint (and its persistence guarantees)
    // is reused unchanged for every file.
    for (let i = 0; i < stagedFiles.length; i++) {
      setUploadProgress({ done: i, total });
      try {
        await onUploadFile(stagedFiles[i].file);
        succeeded++;
      } catch (err: any) {
        failedNames.push(stagedFiles[i].file.name);
      }
    }
    setUploadProgress({ done: total, total });

    if (failedNames.length === 0) {
      setSuccessMsg(
        total === 1
          ? `"${stagedFiles[0].file.name}" uploaded and published successfully`
          : `${succeeded} photo${succeeded === 1 ? '' : 's'} uploaded and published successfully`
      );
      handleClearStaged();
    } else if (succeeded > 0) {
      setErrorMsg(`${succeeded}/${total} uploaded. Failed: ${failedNames.join(', ')}`);
      // Keep only the failed ones staged so the admin can retry them.
      setStagedFiles((prev) => prev.filter((entry) => failedNames.includes(entry.file.name)));
    } else {
      setErrorMsg('Failed to upload image(s) from device');
    }

    setIsUploading(false);
    setUploadProgress(null);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length) handleStageFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files || []) as File[];
    if (files.length) {
      handleStageFiles(files);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setErrorMsg('Please enter a valid URL starting with http:// or https://');
      return;
    }

    clearMessages();
    setIsUploading(true);

    try {
      await onAddUrl(cleanUrl);
      setUrlInput('');
      setSuccessMsg('Image URL added and published successfully');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add image by URL');
    } finally {
      setIsUploading(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-6">
      {/* Upload mode tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-3">
        <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono mr-2">
          Add New Image:
        </span>
        <button
          type="button"
          onClick={() => {
            setActiveTab('device');
            clearMessages();
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
            activeTab === 'device'
              ? 'bg-neutral-100 text-neutral-950 shadow-sm'
              : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          UPLOAD FROM DEVICE
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('url');
            clearMessages();
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
            activeTab === 'url'
              ? 'bg-neutral-100 text-neutral-950 shadow-sm'
              : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          UPLOAD FROM URL
        </button>
      </div>

      {/* Tab 1: Device Upload Dropzone */}
      {activeTab === 'device' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isUploading}
            multiple
          />

          {stagedFiles.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (!disabled && !isUploading) {
                  fileInputRef.current?.click();
                }
              }}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-amber-400 bg-amber-400/5'
                  : 'border-neutral-700 hover:border-neutral-500 bg-neutral-950/50'
              } ${disabled || isUploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div className="w-12 h-12 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mb-3 text-neutral-300">
                <Images className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-neutral-200 mb-1">
                Drag and drop photos here, or <span className="text-amber-400 underline underline-offset-2">browse device</span>
              </p>
              <p className="text-xs text-neutral-500 max-w-md">{helperText}</p>
            </div>
          ) : (
            /* Staged Multi-Image Preview Grid with Explicit Action Buttons */
            <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  {stagedFiles.length} photo{stagedFiles.length === 1 ? '' : 's'} selected
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!disabled && !isUploading) fileInputRef.current?.click();
                  }}
                  disabled={isUploading}
                  className="text-[11px] font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
                >
                  + Add more
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-72 overflow-y-auto pr-1">
                {stagedFiles.map((entry, index) => (
                  <div
                    key={`${entry.file.name}-${entry.file.lastModified}-${index}`}
                    className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 group"
                  >
                    <img
                      src={entry.previewUrl}
                      alt={entry.file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3 h-3" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStagedAt(index)}
                      disabled={isUploading}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600/90 rounded-full p-1 text-white transition-colors disabled:opacity-40"
                      aria-label={`Remove ${entry.file.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm px-1.5 py-1">
                      <div className="text-[9px] font-mono text-neutral-300 truncate">
                        {formatFileSize(entry.file.size)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-amber-400/90 font-sans">
                Ready to upload to server storage and register in database.
              </p>

              {uploadProgress && isUploading && (
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Uploading {uploadProgress.done + 1} of {uploadProgress.total}...
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleClearStaged}
                  disabled={isUploading}
                  className="w-full sm:w-auto px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  CANCEL ALL
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpload}
                  disabled={isUploading}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg font-mono tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/10 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      SAVING & PUBLISHING...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {submitButtonText} {stagedFiles.length > 1 ? `(${stagedFiles.length})` : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: URL Upload Form */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format..."
                disabled={disabled || isUploading}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-9 pr-3 py-2.5 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={disabled || isUploading || !urlInput.trim()}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-lg font-mono tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  SAVING TO DATABASE...
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  SAVE & PUBLISH URL
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-neutral-500">
            Paste any direct HTTPS image link (Unsplash, Cloudinary, AWS S3, etc.).
          </p>
        </form>
      )}

      {/* Feedback banners */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};

