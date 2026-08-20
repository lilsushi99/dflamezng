import { PhotoAsset, ProjectGallery, SocialLink } from '../types/portfolio';
import {
  TOP_PHOTO_ASSETS,
  BOTTOM_PHOTO_ASSETS,
  PROJECTS_GALLERY,
  SOCIAL_LINKS,
  CASTEL_STUDIOS_URL,
} from './portfolioData';

export interface PublicSiteState {
  photographerName: string;
  professionSubtitle: string;
  topTrackPhotos: PhotoAsset[];
  bottomTrackPhotos: PhotoAsset[];
  projects: ProjectGallery[];
  socialLinks: SocialLink[];
  footerCopyright: string;
  footerDesignCreditText: string;
  footerDesignCreditUrl: string;
}

const DEFAULT_STATE: PublicSiteState = {
  photographerName: 'Gold Akingbade',
  professionSubtitle: 'Fashion & Editorial Art Direction Photography',
  topTrackPhotos: TOP_PHOTO_ASSETS,
  bottomTrackPhotos: BOTTOM_PHOTO_ASSETS,
  projects: PROJECTS_GALLERY,
  socialLinks: SOCIAL_LINKS,
  footerCopyright: 'Flames Photography © 2026',
  footerDesignCreditText: 'Castel Studios',
  footerDesignCreditUrl: CASTEL_STUDIOS_URL,
};

class PublicApiService {
  private state: PublicSiteState = { ...DEFAULT_STATE };
  private listeners: Set<(state: PublicSiteState) => void> = new Set();
  private hasFetched: boolean = false;

  constructor() {
    this.fetchInitialData();
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

  public async fetchInitialData(): Promise<void> {
    if (this.hasFetched) return;
    this.hasFetched = true;

    try {
      // 1. Fetch Home Data
      const homeRes = await fetch('/api/home');
      if (homeRes.ok) {
        const homeData = await homeRes.json();
        if (homeData.success) {
          if (homeData.siteSettings?.photographer_name) {
            this.state.photographerName = homeData.siteSettings.photographer_name;
          }
          if (homeData.siteSettings?.profession_subtitle) {
            this.state.professionSubtitle = homeData.siteSettings.profession_subtitle;
          }
          if (Array.isArray(homeData.socialLinks) && homeData.socialLinks.length > 0) {
            this.state.socialLinks = homeData.socialLinks.map((s: any) => ({
              id: s.platform || String(s.id),
              label: s.label || s.platform?.toUpperCase(),
              href: s.url,
            }));
          }

          // Map front track
          if (Array.isArray(homeData.frontImages) && homeData.frontImages.length > 0) {
            this.state.topTrackPhotos = homeData.frontImages.map((img: any, idx: number) => {
              const defaultAsset = TOP_PHOTO_ASSETS[idx] || TOP_PHOTO_ASSETS[0];
              return {
                id: `front-${img.id || idx + 1}`,
                projectId: img.project_id ? String(img.project_id) : defaultAsset.projectId,
                filename: img.filename || `front-${idx + 1}.jpg`,
                src: img.image_path || defaultAsset.src,
                fallbackSrc: defaultAsset.fallbackSrc,
                title: img.title || defaultAsset.title,
                projectCode: defaultAsset.projectCode,
                projectName: defaultAsset.projectName,
                year: defaultAsset.year,
                location: defaultAsset.location,
                aspectRatio: defaultAsset.aspectRatio,
                widthClass: defaultAsset.widthClass,
                heightClass: defaultAsset.heightClass,
                verticalOffset: defaultAsset.verticalOffset,
                category: defaultAsset.category,
              };
            });
          }

          // Map back track
          if (Array.isArray(homeData.backImages) && homeData.backImages.length > 0) {
            this.state.bottomTrackPhotos = homeData.backImages.map((img: any, idx: number) => {
              const defaultAsset = BOTTOM_PHOTO_ASSETS[idx] || BOTTOM_PHOTO_ASSETS[0];
              return {
                id: `back-${img.id || idx + 1}`,
                projectId: img.project_id ? String(img.project_id) : defaultAsset.projectId,
                filename: img.filename || `back-${idx + 1}.jpg`,
                src: img.image_path || defaultAsset.src,
                fallbackSrc: defaultAsset.fallbackSrc,
                title: img.title || defaultAsset.title,
                projectCode: defaultAsset.projectCode,
                projectName: defaultAsset.projectName,
                year: defaultAsset.year,
                location: defaultAsset.location,
                aspectRatio: defaultAsset.aspectRatio,
                widthClass: defaultAsset.widthClass,
                heightClass: defaultAsset.heightClass,
                verticalOffset: defaultAsset.verticalOffset,
                category: defaultAsset.category,
              };
            });
          }
        }
      }

      // 2. Fetch Projects Data
      const projectsRes = await fetch('/api/projects');
      if (projectsRes.ok) {
        const pData = await projectsRes.json();
        if (pData.success && Array.isArray(pData.projects) && pData.projects.length > 0) {
          this.state.projects = pData.projects.map((proj: any, pIdx: number) => {
            const fallbackProj = PROJECTS_GALLERY[pIdx] || PROJECTS_GALLERY[0];
            const nextIdx = pIdx === pData.projects.length - 1 ? 0 : pIdx + 1;
            const prevIdx = pIdx === 0 ? pData.projects.length - 1 : pIdx - 1;

            return {
              id: String(proj.id),
              code: proj.code || String(proj.id).padStart(2, '0'),
              slug: String(proj.id),
              title: proj.title || fallbackProj.title,
              statement: proj.statement || fallbackProj.statement,
              subtitle: proj.subtitle || fallbackProj.subtitle,
              year: String(proj.year || fallbackProj.year),
              location: proj.location || fallbackProj.location,
              category: proj.category || fallbackProj.category,
              story: proj.story || fallbackProj.story,
              client: proj.client || fallbackProj.client,
              creativeDirection: proj.creative_direction || fallbackProj.creativeDirection,
              styling: proj.styling || fallbackProj.styling,
              description: proj.description || fallbackProj.description,
              coverImage: proj.cover_image || fallbackProj.coverImage,
              nextProjectSlug: String(pData.projects[nextIdx]?.id || fallbackProj.nextProjectSlug),
              prevProjectSlug: String(pData.projects[prevIdx]?.id || fallbackProj.prevProjectSlug),
              images: Array.isArray(proj.images) && proj.images.length > 0
                ? proj.images.map((img: any, iIdx: number) => {
                    const fallbackImg = fallbackProj.images[iIdx] || fallbackProj.images[0];
                    return {
                      id: `p${proj.id}-${img.id || iIdx + 1}`,
                      filename: img.filename || `PROJ-${proj.id}.${iIdx + 1}.jpg`,
                      src: img.image_path || fallbackImg.src,
                      fallbackSrc: fallbackImg.fallbackSrc,
                      caption: img.caption || fallbackImg.caption,
                      aspectRatio: img.aspect_ratio || fallbackImg.aspectRatio,
                      orientation: fallbackImg.orientation,
                      layoutRole: fallbackImg.layoutRole,
                      plateNumber: `Plate 0${iIdx + 1}/06`,
                      subtitle: fallbackImg.subtitle,
                    };
                  })
                : fallbackProj.images,
            };
          });
        }
      }

      // 3. Fetch Footer Data
      const footerRes = await fetch('/api/footer');
      if (footerRes.ok) {
        const fData = await footerRes.json();
        if (fData.success && fData.footer) {
          if (fData.footer.copyright_text) {
            this.state.footerCopyright = fData.footer.copyright_text;
          }
          if (fData.footer.design_credit_text) {
            this.state.footerDesignCreditText = fData.footer.design_credit_text;
          }
          if (fData.footer.design_credit_url) {
            this.state.footerDesignCreditUrl = fData.footer.design_credit_url;
          }
        }
      }

      this.notify();
    } catch (err) {
      console.warn('API sync fallback to curated assets:', err);
    }
  }

  public getProjectBySlug(slug: string): ProjectGallery | null {
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
}

export const publicApiService = new PublicApiService();
