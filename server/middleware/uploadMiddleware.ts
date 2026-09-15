import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { persistentStorageRoot } from '../config/storage';

// ============================================================================
// SECURITY NOTES (read before changing):
//
// 1. The stored file's EXTENSION is chosen by the SERVER from a fixed map
//    keyed to the browser-reported mimetype - never taken from the user's
//    original filename. Multer's fileFilter only screens the mimetype the
//    browser *claims*; a raw multipart request can set any Content-Type it
//    wants regardless of the file's real bytes, and if the on-disk extension
//    were derived from the attacker's filename (e.g. "shell.php"), a
//    misconfigured static host could end up executing it. Picking the
//    extension server-side from an allow-list removes that path entirely,
//    independent of anything else below.
//
// 2. After multer writes the file to disk, verifyMagicBytes() re-checks the
//    file's *actual* content (magic-number sniffing via `file-type`) against
//    the mimetypes this upload route permits, and deletes the file if it
//    doesn't match. This catches spoofed Content-Type headers that the
//    fileFilter alone can't.
//
// 3. SVG is XML, not a binary format with magic bytes, so it's handled
//    separately: sanitizeSvgFile() strips <script> tags, event-handler
//    attributes (onload=, onclick=, etc.), and javascript: URIs before the
//    file is accepted, since SVG served directly to a browser tab can
//    otherwise execute embedded script (stored XSS).
// ============================================================================

const rootStorageDir = persistentStorageRoot;
const directories = [
  path.join(rootStorageDir, 'splash'),
  path.join(rootStorageDir, 'homepage', 'front'),
  path.join(rootStorageDir, 'homepage', 'back'),
  path.join(rootStorageDir, 'projects'),
  path.join(rootStorageDir, 'logos'),
  path.join(rootStorageDir, 'seo'),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Server-controlled mimetype -> extension map. Only these mimetypes may ever
// be accepted anywhere in this file; the extension written to disk always
// comes from this map, never from the client-supplied filename.
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
  'image/svg+xml': '.svg',
};

function safeExtensionFor(mimetype: string): string | null {
  return MIME_TO_EXT[mimetype.toLowerCase()] || null;
}

function makeFilename(mimetype: string): string {
  const ext = safeExtensionFor(mimetype) || '.bin';
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `upload-${uniqueSuffix}${ext}`;
}

// Configure disk storage generator
export function createStorage(destinationFolder: string) {
  return multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
      const targetDir = path.join(rootStorageDir, destinationFolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      cb(null, targetDir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      cb(null, makeFilename(file.mimetype));
    },
  });
}

// File filter for validating standard raster image formats
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
  ];

  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, GIF, and AVIF images are permitted.'));
  }
};

const limits = {
  fileSize: 30 * 1024 * 1024, // 30MB
};

export const rootStoragePath = rootStorageDir;

// ---------------------------------------------------------------------------
// Post-upload verification middleware
// ---------------------------------------------------------------------------

/**
 * Re-checks the uploaded file's real bytes against an allow-list of
 * magic-number-detected mimetypes. Must run AFTER the relevant multer
 * middleware (req.file must already be populated). Deletes the file and
 * responds 400 on mismatch instead of calling next().
 */
export function verifyMagicBytes(allowedMimeTypes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return next();

    try {
      // Cast around a TS module-resolution quirk: with "moduleResolution":
      // "bundler" the type checker picks file-type's browser-safe "core"
      // export (no filesystem access) instead of its Node export, even
      // though Node itself resolves the Node export correctly at runtime.
      const fileTypeModule = (await import('file-type')) as unknown as {
        fileTypeFromFile: (path: string) => Promise<{ mime: string; ext: string } | undefined>;
      };
      const detected = await fileTypeModule.fileTypeFromFile(file.path);

      if (!detected || !allowedMimeTypes.includes(detected.mime)) {
        fs.unlink(file.path, () => {});
        res.status(400).json({
          success: false,
          message: 'Uploaded file content does not match a permitted image format.',
        });
        return;
      }
      next();
    } catch (e) {
      // If sniffing itself fails, fail closed - reject rather than accept
      // an unverified file.
      fs.unlink(file.path, () => {});
      console.error('[Upload] Magic-byte verification failed:', e);
      res.status(400).json({
        success: false,
        message: 'Could not verify uploaded file content.',
      });
    }
  };
}

/**
 * Sanitizes an already-saved SVG file in place: strips <script> elements,
 * on*="" event-handler attributes, and javascript: URIs. Must run AFTER the
 * relevant multer middleware. Rejects (deletes + 400) anything that doesn't
 * look like a well-formed SVG document at all.
 */
export function sanitizeSvgUpload() {
  return (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return next();
    if (path.extname(file.filename).toLowerCase() !== '.svg') return next();

    try {
      let content = fs.readFileSync(file.path, 'utf8');

      if (!/<svg[\s>]/i.test(content)) {
        fs.unlink(file.path, () => {});
        res.status(400).json({ success: false, message: 'Invalid SVG file.' });
        return;
      }

      content = content
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/\son\w+\s*=\s*"(?:[^"]*)"/gi, '')
        .replace(/\son\w+\s*=\s*'(?:[^']*)'/gi, '')
        .replace(/(href|xlink:href)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1=$2#$2')
        .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');

      fs.writeFileSync(file.path, content, 'utf8');
      next();
    } catch (e) {
      fs.unlink(file.path, () => {});
      console.error('[Upload] SVG sanitization failed:', e);
      res.status(400).json({ success: false, message: 'Could not process SVG file.' });
    }
  };
}

export const uploadSplash = multer({
  storage: createStorage('splash'),
  fileFilter: imageFileFilter,
  limits,
});

export const uploadHomepage = multer({
  storage: multer.diskStorage({
    destination: (req: Request, _file: Express.Multer.File, cb) => {
      const trackParam = (
        (req.query.track as string) ||
        (req.body && req.body.track) ||
        'front'
      ).toString().toLowerCase();
      const subFolder = trackParam === 'back' ? 'back' : 'front';
      const targetDir = path.join(rootStorageDir, 'homepage', subFolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      cb(null, targetDir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
      cb(null, makeFilename(file.mimetype));
    },
  }),
  fileFilter: imageFileFilter,
  limits,
});

export const uploadHomepageFront = multer({
  storage: createStorage(path.join('homepage', 'front')),
  fileFilter: imageFileFilter,
  limits,
});

export const uploadHomepageBack = multer({
  storage: createStorage(path.join('homepage', 'back')),
  fileFilter: imageFileFilter,
  limits,
});

export const uploadProject = multer({
  storage: createStorage('projects'),
  fileFilter: imageFileFilter,
  limits,
});

export const uploadLogo = multer({
  storage: createStorage('logos'),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid logo format. Permitted: PNG, SVG, JPG, WEBP.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadFavicon = multer({
  storage: createStorage('seo'),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowed = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/svg+xml'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid favicon format. Permitted: PNG, ICO, SVG.'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadSeoImage = multer({
  storage: createStorage('seo'),
  fileFilter: imageFileFilter,
  limits,
});

// Convenience bundles: the raster-image mimetypes that verifyMagicBytes()
// should accept for routes using the generic imageFileFilter.
export const STANDARD_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
export const ICON_IMAGE_MIMES = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'];

/**
 * For routes that accept SVG alongside raster formats (logo, favicon):
 * SVGs go through sanitizeSvgUpload, everything else goes through
 * verifyMagicBytes against the given raster allow-list.
 */
export function verifyImageOrSanitizeSvg(allowedRasterMimes: string[]) {
  const sanitizeSvg = sanitizeSvgUpload();
  const verifyRaster = verifyMagicBytes(allowedRasterMimes);
  return (req: Request, res: Response, next: NextFunction) => {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file && path.extname(file.filename).toLowerCase() === '.svg') {
      return sanitizeSvg(req, res, next);
    }
    return verifyRaster(req, res, next);
  };
}
