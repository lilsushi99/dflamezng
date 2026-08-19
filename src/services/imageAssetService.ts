import { PhotoAsset, ProjectGallery } from '../types/portfolio';
import { TOP_PHOTO_ASSETS, BOTTOM_PHOTO_ASSETS, PROJECTS_GALLERY } from './portfolioData';

/**
 * Service to resolve image assets and projects.
 * Respects the filename contract (1.jpg, 2.jpg... and 1.1.jpg, 1.2.jpg...)
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
      (p) => p.slug === slug || p.slug === normalized || p.code === slug || p.code === `0${slug}`
    );
    return found || null;
  }

  public static getProjectByCode(code: string): ProjectGallery | null {
    return this.getProjectBySlug(code);
  }
}
