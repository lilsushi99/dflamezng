import { PhotoAsset, ProjectGallery } from '../types/portfolio';
import { TOP_PHOTO_ASSETS, BOTTOM_PHOTO_ASSETS, PROJECTS_GALLERY } from './portfolioData';

/**
 * Service to resolve image assets and projects.
 * Respects the filename contract (front-1.jpg..front-5.jpg, back-1.jpg..back-5.jpg, and PROJ-X.Y.jpg)
 * and falls back to curated high-resolution photography placeholders if local assets
 * have not been dropped into the assets directory yet.
 */
export class ImageAssetService {
  public static getTopPhotoAssets(): PhotoAsset[] {
    return TOP_PHOTO_ASSETS;
  }

  public static getBottomPhotoAssets(): PhotoAsset[] {
    return BOTTOM_PHOTO_ASSETS;
  }

  public static getAllProjects(): ProjectGallery[] {
    return PROJECTS_GALLERY;
  }

  public static getProjectBySlug(slug: string): ProjectGallery | null {
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
