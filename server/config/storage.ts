import fs from 'fs';
import path from 'path';

/**
 * Resolves where persistent, user-generated data lives on disk: uploaded
 * media (splash/homepage/project/logo/SEO images) and the JSON fallback
 * datastore used when MySQL is unreachable.
 *
 * WHY THIS EXISTS / READ THIS BEFORE CHANGING IT:
 * Some Git-based deploy workflows (including some "Deploy from GitHub"
 * setups on shared hosting like Hostinger) recreate the live application
 * folder from a fresh checkout of the repository on every deploy. If
 * persistent data is written inside that folder, it gets wiped on every
 * deploy - .gitignore only stops future commits, it does NOT protect
 * existing files from a fresh checkout/clone.
 *
 * The fix: point PERSISTENT_STORAGE_PATH at a directory OUTSIDE the git
 * repository - somewhere on the server that a redeploy never touches - and
 * everything written here survives deploys regardless of how the deploy
 * mechanism works.
 *
 * Local development: leave PERSISTENT_STORAGE_PATH unset and it defaults to
 * ./storage inside the repo, which is fine for local testing.
 *
 * Production (Hostinger): set PERSISTENT_STORAGE_PATH as an environment
 * variable to an absolute path OUTSIDE the deployed repo folder, e.g.
 * something like /home/<hostinger-username>/dflamez-persistent-storage
 * (create that folder once via File Manager or SSH, outside your git repo
 * folder, then point the env var at it). Ask your host / check hPanel if
 * you're not sure which absolute path is safe from redeploys.
 */
export const persistentStorageRoot: string = process.env.PERSISTENT_STORAGE_PATH
  ? path.resolve(process.env.PERSISTENT_STORAGE_PATH)
  : path.join(process.cwd(), 'storage');

export const isUsingExternalStoragePath = Boolean(process.env.PERSISTENT_STORAGE_PATH);

/**
 * Deletes a locally-uploaded media file from disk given its public URL path
 * (e.g. "/storage/splash/xyz.jpg"). Safe no-op for external URLs, missing
 * paths, or files that don't exist. Used whenever an image/video record is
 * deleted, so deleting in /fire actually frees disk space instead of
 * leaving orphaned files behind forever.
 */
export function deleteStoredFile(filePath: string | null | undefined): void {
  if (!filePath || !filePath.startsWith('/storage/')) return;
  try {
    const relative = filePath.replace(/^\/storage\//, '');
    const fullPath = path.join(persistentStorageRoot, relative);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (e) {
    console.warn('[Storage] Failed to delete stored file:', filePath, e);
  }
}
