export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export interface PhotoAsset {
  id: string;
  filename: string;
  src: string;
  fallbackSrc: string;
  title: string;
  projectCode: string;
  projectName: string;
  year: string;
  location?: string;
  aspectRatio: string; // e.g. '3/4', '4/5', '2/3', '1/1', '16/10', '4/3'
  widthClass: string;
  heightClass: string;
  verticalOffset?: string;
  category: 'fashion' | 'editorial' | 'portrait' | 'art-direction' | 'documentary';
}

export type GalleryLayoutRole =
  | 'lead-feature'
  | 'secondary-portrait'
  | 'secondary-landscape'
  | 'wide-spread'
  | 'offset-pair'
  | 'detail-focus'
  | 'standalone';

export interface GalleryImage {
  id: string;
  filename: string; // e.g. '1.1.jpg', '1.2.jpg'
  src: string;
  fallbackSrc: string;
  caption: string;
  aspectRatio: string; // e.g. '3/4', '4/5', '16/10', '1/1', '2/3'
  orientation: 'portrait' | 'landscape' | 'square';
  layoutRole: GalleryLayoutRole;
  plateNumber: string; // e.g. 'Plate 01'
  subtitle?: string;
}

export interface ProjectGallery {
  id: string;
  code: string; // '01', '02', etc. (also accessible via slug / 1, 2)
  slug: string; // '1', '2', '3', '4'
  title: string;
  statement: string; // Bold, confident editorial serif concept phrase
  subtitle: string;
  year: string;
  location: string;
  category: string;
  client?: string;
  creativeDirection?: string;
  styling?: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
  nextProjectSlug?: string;
  prevProjectSlug?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  target?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  projectType: string;
  timeline: string;
  message: string;
  budget?: string;
}
