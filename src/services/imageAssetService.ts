import { PhotoAsset, ProjectGallery } from '../types/portfolio';
import { TOP_PHOTO_ASSETS, BOTTOM_PHOTO_ASSETS, PROJECTS_GALLERY } from './portfolioData';
import { publicApiService } from './publicApiService';

/**
 * Service to resolve image assets and projects.
 * Dynamically queries the backend CMS / database while gracefully falling
 * back to curated high-resolution photography placeholders if offline or loading.
 */
export class ImageAssetService {
  public static getTopPhotoAssets(): PhotoAsset[] {
    const live = publicApiService.getState().topTrackPhotos;
    return live && live.length > 0 ? live : TOP_PHOTO_ASSETS;
  }

  public static getBottomPhotoAssets(): PhotoAsset[] {
    const live = publicApiService.getState().bottomTrackPhotos;
    return live && live.length > 0 ? live : BOTTOM_PHOTO_ASSETS;
  }

  public static getAllProjects(): ProjectGallery[] {
    const live = publicApiService.getState().projects;
    return live && live.length > 0 ? live : PROJECTS_GALLERY;
  }

  public static getProjectBySlug(slug: string): ProjectGallery | null {
    const fromApi = publicApiService.getProjectBySlug(slug);
    if (fromApi) return fromApi;

    const normalized = slug.replace(/^0+/, '');
    const found = PROJECTS_GALLERY.find(
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

  public static getProjectById(id: string): ProjectGallery | null {
    return this.getProjectBySlug(id);
  }

  public static getProjectByCode(code: string): ProjectGallery | null {
    return this.getProjectBySlug(code);
  }
}

