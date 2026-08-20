export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export interface PhotoAsset {
  id: string;
  projectId?: string; // '1' | '2' | '3' | '4' | '5'
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
  code: string; // '01', '02', '03', '04', '05'
  slug: string; // '1', '2', '3', '4', '5'
  title: string;
  statement?: string; // Editorial concept phrase
  subtitle: string;
  year: string;
  location: string;
  category: string; // e.g. 'FASHION', 'EDITORIAL', 'PORTRAIT', etc.
  story?: string; // Dedicated project story
  client?: string; // Optional legacy data
  creativeDirection?: string; // Optional legacy data
  styling?: string; // Optional legacy data
  description: string;
  coverImage: string;
  homepageImages?: PhotoAsset[];
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
