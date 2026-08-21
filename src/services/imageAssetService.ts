import { PhotoAsset, ProjectGallery } from '../types/portfolio';
import { publicApiService } from './publicApiService';

/**
 * Service to resolve image assets and projects purely from the database/API.
 * Zero hardcoded fallbacks to dummy data.
 */
export class ImageAssetService {
  public static getTopPhotoAssets(): PhotoAsset[] {
    return publicApiService.getState().topTrackPhotos;
  }

  public static getBottomPhotoAssets(): PhotoAsset[] {
    return publicApiService.getState().bottomTrackPhotos;
  }

  public static getAllProjects(): ProjectGallery[] {
    return publicApiService.getState().projects;
  }

  public static getProjectBySlug(slug: string): ProjectGallery | null {
    return publicApiService.getProjectBySlug(slug);
  }

  public static getProjectById(id: string): ProjectGallery | null {
    return publicApiService.getProjectBySlug(id);
  }

  public static getProjectByCode(code: string): ProjectGallery | null {
    return publicApiService.getProjectBySlug(code);
  }
}
