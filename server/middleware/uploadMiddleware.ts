import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure storage subdirectories exist
const rootStorageDir = path.join(process.cwd(), 'storage');
const directories = [
  path.join(rootStorageDir, 'splash'),
  path.join(rootStorageDir, 'homepage', 'front'),
  path.join(rootStorageDir, 'homepage', 'back'),
  path.join(rootStorageDir, 'projects'),
  path.join(rootStorageDir, 'logos'),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(sanitizedName) || '.jpg';
      const baseName = path.basename(sanitizedName, ext).substring(0, 30);
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
  });
}

// File filter for validating image formats
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

export const uploadSplash = multer({
  storage: createStorage('splash'),
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
    const allowed = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
    ];
    if (allowed.includes(file.mimetype.toLowerCase()) || file.originalname.endsWith('.svg')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid logo format. Permitted: PNG, SVG, JPG, WEBP.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});
