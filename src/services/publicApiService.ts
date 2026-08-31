import { PhotoAsset, ProjectGallery, SocialLink, GalleryLayoutRole, GalleryImage } from '../types/portfolio';

export interface SplashData {
  isEnabled: boolean;
  photographerName: string;
  signatureText: string;
  subtext: string;
  typewriterEnabled: boolean;
  typingSpeedMs: number;
  stackDurationMs: number;
  images: {
    id: string;
    src: string;
    displayOrder: number;
  }[];
}

export interface PublicSiteState {
  isLoaded: boolean;
  photographerName: string;
  studioName: string;
  professionSubtitle: string;
  locationPrimary: string;
  locationSecondary: string;
  availabilityPrimary: string;
  availabilitySecondary: string;
  contactEmail: string;
  contactPhone: string;
  isAvailable: boolean;
  logoType: 'TEXT' | 'IMAGE';
  navbarLogoText: string;
  logoImagePath: string | null;
  navbarProjectsLabel: string;
  navbarContactLabel: string;
  themeToggleVisible: boolean;
  themeMode?: 'DARK' | 'LIGHT';
  topTrackPhotos: PhotoAsset[];
  bottomTrackPhotos: PhotoAsset[];
  projects: ProjectGallery[];
  socialLinks: SocialLink[];
  footerCopyright: string;
  footerDesignCreditText: string;
  footerDesignCreditUrl: string;
  splash: SplashData;
}

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE = `${API_ROOT}/api`;

export function resolveImageUrl(item: { file_path?: string | null; external_url?: string | null; source_type?: string } | null | undefined): string {
  if (!item) return '';
  const sourceType = (item.source_type || '').toLowerCase();
  
  if (sourceType === 'url' || sourceType === 'external') {
    return item.external_url || item.file_path || '';
  }

  const path = item.file_path || item.external_url || '';
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_ROOT}${cleanPath}`;
}

const SIZING_VARIATIONS = [
  { widthClass: 'w-44 sm:w-52 md:w-60 lg:w-64', heightClass: 'h-60 sm:h-70 md:h-80 lg:h-88', verticalOffset: 'mt-0', aspectRatio: '3/4' },
  { widthClass: 'w-52 sm:w-64 md:w-72 lg:w-80', heightClass: 'h-40 sm:h-48 md:h-56 lg:h-60', verticalOffset: 'mt-4 sm:mt-6', aspectRatio: '16/10' },
  { widthClass: 'w-40 sm:w-48 md:w-56 lg:w-60', heightClass: 'h-52 sm:h-60 md:h-72 lg:h-76', verticalOffset: 'mt-1 sm:mt-2', aspectRatio: '2/3' },
  { widthClass: 'w-48 sm:w-56 md:w-64 lg:w-72', heightClass: 'h-48 sm:h-56 md:h-64 lg:h-72', verticalOffset: 'mt-3 sm:mt-5', aspectRatio: '1/1' },
  { widthClass: 'w-44 sm:w-52 md:w-60 lg:w-64', heightClass: 'h-56 sm:h-64 md:h-76 lg:h-80', verticalOffset: 'mt-0', aspectRatio: '4/5' },
];

const GALLERY_ROLES: GalleryLayoutRole[] = [
  'lead-feature',
  'secondary-portrait',
  'wide-spread',
  'offset-pair',
  'standalone',
  'secondary-portrait',
];

const INITIAL_EMPTY_STATE: PublicSiteState = {
  isLoaded: false,
  photographerName: '',
  studioName: '',
  professionSubtitle: '',
  locationPrimary: 'Akure / Lagos',
  locationSecondary: 'Nigeria',
  availabilityPrimary: 'Open to Travel',
  availabilitySecondary: 'Worldwide & Commissions',
  contactEmail: 'studio@goldakingbade.com',
  contactPhone: '+234 812 345 6789',
  isAvailable: true,
  logoType: 'TEXT',
  navbarLogoText: '',
  logoImagePath: null,
  navbarProjectsLabel: 'PROJECTS',
  navbarContactLabel: 'CONTACT',
  themeToggleVisible: true,
  themeMode: 'DARK',
  topTrackPhotos: [],
  bottomTrackPhotos: [],
  projects: [],
  socialLinks: [],
  footerCopyright: '',
  footerDesignCreditText: '',
  footerDesignCreditUrl: '',
  splash: {
    isEnabled: true,
    photographerName: '',
    signatureText: '',
    subtext: '',
    typewriterEnabled: true,
    typingSpeedMs: 65,
    stackDurationMs: 3200,
    images: [],
  },
};

class PublicApiService {
  private state: PublicSiteState = { ...INITIAL_EMPTY_STATE };
  private listeners: Set<(state: PublicSiteState) => void> = new Set();
  private fetchPromise: Promise<void> | null = null;

  constructor() {
    this.fetchData();
  }

  public getState(): PublicSiteState {
    return this.state;
  }

  public subscribe(listener: (state: PublicSiteState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public async fetchData(): Promise<void> {
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = (async () => {
      try {
        await Promise.allSettled([
          this.fetchSplash(),
          this.fetchHome(),
          this.fetchProjects(),
          this.fetchFooter(),
        ]);
        this.state.isLoaded = true;
      } catch (err) {
        console.error('[PublicApiService] Data fetch error:', err);
      } finally {
        this.notify();
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  private async fetchSplash(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/splash`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;

      const s = data.settings || {};
      const rawImages = Array.isArray(data.images) ? data.images : [];

      const mappedImages = rawImages.map((img: any) => ({
        id: String(img.id),
        src: resolveImageUrl(img),
        displayOrder: Number(img.display_order) || 0,
      })).sort((a: any, b: any) => a.displayOrder - b.displayOrder);

      this.state.splash = {
        isEnabled: s.is_enabled !== false,
        photographerName: s.photographer_name ?? '',
        signatureText: s.signature_text ?? s.photographer_name ?? '',
        subtext: s.subtext ?? s.splash_subtext ?? '',
        typewriterEnabled: s.typewriter_enabled !== false,
        typingSpeedMs: Number(s.typing_speed_ms) || 65,
        stackDurationMs: Number(s.stack_duration_ms) || 3200,
        images: mappedImages,
      };
    } catch (err) {
      console.warn('[PublicApiService] Splash endpoint error:', err);
    }
  }

  private async fetchHome(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/home`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;

      const site = data.siteSettings || {};
      const home = data.settings || {};

      if (site.photographer_name !== undefined) {
        this.state.photographerName = site.photographer_name;
      }
      if (site.studio_name !== undefined) {
        this.state.studioName = site.studio_name;
      }
      if (site.location_text) {
        const parts = site.location_text.split('/').map((s: string) => s.trim());
        if (parts.length > 1) {
          this.state.locationPrimary = parts.slice(0, -1).join(' / ');
          this.state.locationSecondary = parts[parts.length - 1];
        } else {
          this.state.locationPrimary = site.location_text;
        }
      }
      if (site.availability_text) {
        const parts = site.availability_text.split('—').map((s: string) => s.trim());
        if (parts.length > 1) {
          this.state.availabilityPrimary = parts[0];
          this.state.availabilitySecondary = parts.slice(1).join(' — ');
        } else {
          this.state.availabilityPrimary = site.availability_text;
        }
      }
      if (site.contact_email) {
        this.state.contactEmail = site.contact_email;
      }
      if (site.contact_phone) {
        this.state.contactPhone = site.contact_phone;
      }
      if (site.is_available !== undefined) {
        this.state.isAvailable = Boolean(site.is_available);
      }
      this.state.logoType = home.logo_type === 'IMAGE' ? 'IMAGE' : 'TEXT';
      this.state.logoImagePath = resolveImageUrl({ file_path: home.logo_image_path, source_type: 'local' }) || null;
      if (home.navbar_logo_text) {
        this.state.navbarLogoText = home.navbar_logo_text;
      } else if (site.photographer_name) {
        this.state.navbarLogoText = site.photographer_name;
      }
      if (home.navbar_projects_label) {
        this.state.navbarProjectsLabel = home.navbar_projects_label;
      }
      if (home.navbar_contact_label) {
        this.state.navbarContactLabel = home.navbar_contact_label;
      }
      if (home.theme_toggle_visible !== undefined) {
        this.state.themeToggleVisible = Boolean(home.theme_toggle_visible);
      }
      if (home.theme_mode) {
        this.state.themeMode = home.theme_mode;
      }
      if (home.hero_subtext) {
        this.state.professionSubtitle = home.hero_subtext;
      }

      // Map social links
      if (Array.isArray(data.socialLinks)) {
        this.state.socialLinks = data.socialLinks.map((s: any) => ({
          id: s.platform_key || String(s.id),
          label: s.label || (s.platform_key || '').toUpperCase(),
          href: s.url || '#',
        }));
      } else {
        this.state.socialLinks = [];
      }

      // Map front images (Top Track)
      const rawFront = Array.isArray(data.frontImages) ? data.frontImages : [];
      this.state.topTrackPhotos = rawFront.map((img: any, idx: number) => {
        const sizing = SIZING_VARIATIONS[idx % SIZING_VARIATIONS.length];
        const src = resolveImageUrl(img);
        const pId = img.project_id ? String(img.project_id) : undefined;
        return {
          id: `front-${img.id || idx + 1}`,
          projectId: pId,
          filename: img.file_path ? img.file_path.split('/').pop() || `front-${idx + 1}.jpg` : `front-${idx + 1}.jpg`,
          src,
          fallbackSrc: src,
          title: img.title || '',
          projectCode: pId ? pId.padStart(2, '0') : '',
          projectName: img.project_name || '',
          year: img.year || '2025',
          location: img.location || '',
          aspectRatio: sizing.aspectRatio,
          widthClass: sizing.widthClass,
          heightClass: sizing.heightClass,
          verticalOffset: sizing.verticalOffset,
          category: 'editorial' as const,
        };
      });

      // Map back images (Bottom Track)
      const rawBack = Array.isArray(data.backImages) ? data.backImages : [];
      this.state.bottomTrackPhotos = rawBack.map((img: any, idx: number) => {
        const sizing = SIZING_VARIATIONS[idx % SIZING_VARIATIONS.length];
        const src = resolveImageUrl(img);
        const pId = img.project_id ? String(img.project_id) : undefined;
        return {
          id: `back-${img.id || idx + 1}`,
          projectId: pId,
          filename: img.file_path ? img.file_path.split('/').pop() || `back-${idx + 1}.jpg` : `back-${idx + 1}.jpg`,
          src,
          fallbackSrc: src,
          title: img.title || '',
          projectCode: pId ? pId.padStart(2, '0') : '',
          projectName: img.project_name || '',
          year: img.year || '2025',
          location: img.location || '',
          aspectRatio: sizing.aspectRatio,
          widthClass: sizing.widthClass,
          heightClass: sizing.heightClass,
          verticalOffset: sizing.verticalOffset,
          category: 'editorial' as const,
        };
      });
    } catch (err) {
      console.warn('[PublicApiService] Home endpoint error:', err);
    }
  }

  private async fetchProjects(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !Array.isArray(data.projects)) return;

      const rawProjects = data.projects;
      this.state.projects = rawProjects.map((proj: any, pIdx: number) => {
        const nextIdx = pIdx === rawProjects.length - 1 ? 0 : pIdx + 1;
        const prevIdx = pIdx === 0 ? rawProjects.length - 1 : pIdx - 1;
        const pId = String(proj.id);
        const pCode = String(proj.id).padStart(2, '0');

        const rawImages = Array.isArray(proj.images) ? proj.images : [];
        const mappedImages: GalleryImage[] = rawImages.map((img: any, iIdx: number) => {
          const src = resolveImageUrl(img);
          const role = GALLERY_ROLES[iIdx % GALLERY_ROLES.length];
          return {
            id: `p${pId}-${img.id || iIdx + 1}`,
            filename: img.file_path ? img.file_path.split('/').pop() || `img-${iIdx + 1}.jpg` : `img-${iIdx + 1}.jpg`,
            src,
            fallbackSrc: src,
            caption: img.caption || '',
            aspectRatio: img.aspect_ratio || '3/4',
            orientation: 'portrait' as const,
            layoutRole: role,
            plateNumber: `Plate ${String(iIdx + 1).padStart(2, '0')}`,
            subtitle: img.subtitle || '',
          };
        });

        const coverSrc = mappedImages.length > 0 ? mappedImages[0].src : '';

        return {
          id: pId,
          code: pCode,
          slug: pId,
          title: proj.name || proj.title || '',
          statement: proj.statement || proj.subtext || '',
          subtitle: proj.subtext || '',
          year: String(proj.year || '2025'),
          location: proj.location || '',
          category: proj.category || 'EDITORIAL',
          story: proj.story || '',
          description: proj.story || proj.subtext || '',
          coverImage: coverSrc,
          nextProjectSlug: rawProjects.length > 1 ? String(rawProjects[nextIdx].id) : undefined,
          prevProjectSlug: rawProjects.length > 1 ? String(rawProjects[prevIdx].id) : undefined,
          images: mappedImages,
        };
      });
    } catch (err) {
      console.warn('[PublicApiService] Projects endpoint error:', err);
    }
  }

  private async fetchFooter(): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/footer`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !data.footer) return;

      const f = data.footer;
      this.state.footerCopyright = f.copyright_text ?? '';
      this.state.footerDesignCreditText = f.designer_name ?? f.design_credit_text ?? '';
      this.state.footerDesignCreditUrl = f.designer_url ?? f.design_credit_url ?? '';
    } catch (err) {
      console.warn('[PublicApiService] Footer endpoint error:', err);
    }
  }

  public getProjectBySlug(slug: string): ProjectGallery | null {
    if (!slug) return null;
    const normalized = slug.replace(/^0+/, '');
    const found = this.state.projects.find(
      (p) =>
        p.slug === slug ||
        p.slug === normalized ||
        p.id === slug ||
        p.id === normalized ||
        p.code === slug ||
        p.code === `0${slug}`
    );
    return found || null;
  }

  public async fetchGlobalSeo(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/seo/global`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.seo || null;
    } catch {
      return null;
    }
  }

  public async fetchLocations(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/seo/locations`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.locations) ? data.locations : [];
    } catch {
      return [];
    }
  }

  public async fetchLocationBySlug(slug: string): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE}/seo/locations/${encodeURIComponent(slug)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.location ? data : null;
    } catch {
      return null;
    }
  }

  public async submitInquiry(payload: {
    name: string;
    email: string;
    projectType: string;
    timeline: string;
    message: string;
    budget?: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit inquiry');
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to transmit inquiry' };
    }
  }
}

export const publicApiService = new PublicApiService();
