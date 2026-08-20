import { SiteSettings, SocialLink, FooterSettings } from '../models/Settings';
import { SplashSettings, SplashImage } from '../models/Splash';
import { HomepageSettings, HomepageImage, TrackType } from '../models/Homepage';
import { isDatabaseConnected, query, execute } from '../database/db';
import {
  defaultSiteSettings,
  defaultSplashSettings,
  defaultSplashImages,
  defaultHomepageSettings,
  defaultHomepageImages,
  defaultSocialLinks,
  defaultFooterSettings,
} from '../database/seedData';

let localSiteSettings = { ...defaultSiteSettings };
let localSplashSettings: SplashSettings = { ...defaultSplashSettings };
let localSplashImages: SplashImage[] = JSON.parse(JSON.stringify(defaultSplashImages));
let localHomepageSettings: HomepageSettings = { ...defaultHomepageSettings };
let localHomepageImages: HomepageImage[] = JSON.parse(JSON.stringify(defaultHomepageImages));
let localSocialLinks: SocialLink[] = JSON.parse(JSON.stringify(defaultSocialLinks));
let localFooterSettings: FooterSettings = { ...defaultFooterSettings };

export class SettingsRepository {
  // ==========================================
  // Site Settings
  // ==========================================
  async getSiteSettings(): Promise<SiteSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<SiteSettings>('SELECT * FROM site_settings LIMIT 1');
        if (rows[0]) return rows[0];
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to local store for site_settings:', e);
      }
    }
    return localSiteSettings;
  }

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    if (isDatabaseConnected()) {
      try {
        const current = await this.getSiteSettings();
        await execute(
          `UPDATE site_settings SET 
            site_title = ?, 
            photographer_name = ?, 
            studio_name = ?, 
            contact_email = ?, 
            contact_phone = ?, 
            location_text = ?, 
            is_available = ?, 
            availability_text = ?, 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            data.site_title ?? current.site_title,
            data.photographer_name ?? current.photographer_name,
            data.studio_name ?? current.studio_name,
            data.contact_email ?? current.contact_email,
            data.contact_phone ?? current.contact_phone,
            data.location_text ?? current.location_text,
            data.is_available ?? current.is_available,
            data.availability_text ?? current.availability_text,
            current.id || 1,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] Error executing DB update for site_settings:', e);
      }
    }
    localSiteSettings = {
      ...localSiteSettings,
      ...data,
      updated_at: new Date(),
    };
    return localSiteSettings;
  }

  // ==========================================
  // Splash Settings & Images
  // ==========================================
  async getSplashSettings(): Promise<SplashSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<SplashSettings>('SELECT * FROM splash_settings LIMIT 1');
        if (rows[0]) {
          return {
            ...localSplashSettings,
            ...rows[0],
          };
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to local store for splash_settings:', e);
      }
    }
    return localSplashSettings;
  }

  async updateSplashSettings(data: Partial<SplashSettings>): Promise<SplashSettings> {
    if (isDatabaseConnected()) {
      try {
        const current = await this.getSplashSettings();
        await execute(
          `UPDATE splash_settings SET 
            is_enabled = ?, 
            signature_text = ?, 
            typing_speed_ms = ?, 
            stack_duration_ms = ?, 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            data.is_enabled ?? current.is_enabled,
            data.signature_text ?? current.signature_text,
            data.typing_speed_ms ?? current.typing_speed_ms,
            data.stack_duration_ms ?? current.stack_duration_ms,
            current.id || 1,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] Error executing DB update for splash_settings:', e);
      }
    }
    localSplashSettings = {
      ...localSplashSettings,
      ...data,
      updated_at: new Date(),
    };
    return localSplashSettings;
  }

  async getSplashImages(): Promise<SplashImage[]> {
    if (isDatabaseConnected()) {
      try {
        return await query<SplashImage>('SELECT * FROM splash_images ORDER BY display_order ASC, id ASC');
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to local store for splash_images:', e);
      }
    }
    return [...localSplashImages].sort((a, b) => a.display_order - b.display_order);
  }

  async addSplashImage(image: Omit<SplashImage, 'id' | 'created_at' | 'updated_at'>): Promise<SplashImage> {
    const nextOrder = image.display_order || (localSplashImages.length > 0 ? Math.max(...localSplashImages.map(i => i.display_order)) + 1 : 1);
    
    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO splash_images (file_path, external_url, source_type, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [image.file_path, image.external_url, image.source_type, nextOrder]
        );
        const newId = res.insertId;
        const createdImage: SplashImage = {
          id: newId,
          file_path: image.file_path,
          external_url: image.external_url,
          source_type: image.source_type,
          display_order: nextOrder,
          created_at: new Date(),
          updated_at: new Date(),
        };
        localSplashImages.push(createdImage);
        return createdImage;
      } catch (e) {
        console.warn('[SettingsRepository] DB insert failed for splash image, using local fallback:', e);
      }
    }

    const nextId = localSplashImages.length > 0 ? Math.max(...localSplashImages.map(i => i.id)) + 1 : 1;
    const newImage: SplashImage = {
      id: nextId,
      file_path: image.file_path,
      external_url: image.external_url,
      source_type: image.source_type,
      display_order: nextOrder,
      created_at: new Date(),
      updated_at: new Date(),
    };
    localSplashImages.push(newImage);
    return newImage;
  }

  async reorderSplashImages(orderedIds: number[]): Promise<SplashImage[]> {
    if (isDatabaseConnected()) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          await execute('UPDATE splash_images SET display_order = ?, updated_at = NOW() WHERE id = ?', [i + 1, orderedIds[i]]);
        }
      } catch (e) {
        console.warn('[SettingsRepository] Error reordering splash images in DB:', e);
      }
    }

    orderedIds.forEach((id, index) => {
      const item = localSplashImages.find(img => img.id === id);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    return [...localSplashImages].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteSplashImage(id: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM splash_images WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[SettingsRepository] Error deleting splash image from DB:', e);
      }
    }

    const initialLength = localSplashImages.length;
    localSplashImages = localSplashImages.filter(img => img.id !== id);
    return localSplashImages.length < initialLength;
  }

  // ==========================================
  // Homepage Settings & Images
  // ==========================================
  async getHomepageSettings(): Promise<HomepageSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<HomepageSettings>('SELECT * FROM homepage_settings LIMIT 1');
        if (rows[0]) {
          return {
            ...localHomepageSettings,
            ...rows[0],
          };
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to local store for homepage_settings:', e);
      }
    }
    return localHomepageSettings;
  }

  async updateHomepageSettings(data: Partial<HomepageSettings>): Promise<HomepageSettings> {
    if (isDatabaseConnected()) {
      try {
        const current = await this.getHomepageSettings();
        await execute(
          `UPDATE homepage_settings SET 
            top_track_speed = ?, 
            bottom_track_speed = ?, 
            hero_quote = ?, 
            hero_subtext = ?, 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            data.top_track_speed ?? current.top_track_speed,
            data.bottom_track_speed ?? current.bottom_track_speed,
            data.hero_quote ?? current.hero_quote,
            data.hero_subtext ?? current.hero_subtext,
            current.id || 1,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] Error executing DB update for homepage_settings:', e);
      }
    }
    localHomepageSettings = {
      ...localHomepageSettings,
      ...data,
      updated_at: new Date(),
    };
    return localHomepageSettings;
  }

  async getHomepageImages(track?: TrackType): Promise<HomepageImage[]> {
    if (isDatabaseConnected()) {
      try {
        const sql = track
          ? 'SELECT * FROM homepage_images WHERE track = ? ORDER BY display_order ASC, id ASC'
          : 'SELECT * FROM homepage_images ORDER BY track ASC, display_order ASC, id ASC';
        const params = track ? [track] : [];
        return await query<HomepageImage>(sql, params);
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to local store for homepage_images:', e);
      }
    }
    if (track) {
      return [...localHomepageImages.filter(img => img.track === track)].sort((a, b) => a.display_order - b.display_order);
    }
    return [...localHomepageImages].sort((a, b) => a.display_order - b.display_order);
  }

  async addHomepageImage(image: Omit<HomepageImage, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageImage> {
    const existing = localHomepageImages.filter(i => i.track === image.track);
    const nextOrder = image.display_order || (existing.length > 0 ? Math.max(...existing.map(i => i.display_order)) + 1 : 1);

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO homepage_images (file_path, external_url, source_type, track, project_id, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [image.file_path, image.external_url, image.source_type, image.track, image.project_id || null, nextOrder]
        );
        const newId = res.insertId;
        const createdImage: HomepageImage = {
          id: newId,
          file_path: image.file_path,
          external_url: image.external_url,
          source_type: image.source_type,
          track: image.track,
          project_id: image.project_id || null,
          display_order: nextOrder,
          created_at: new Date(),
          updated_at: new Date(),
        };
        localHomepageImages.push(createdImage);
        return createdImage;
      } catch (e) {
        console.warn('[SettingsRepository] DB insert failed for homepage image:', e);
      }
    }

    const nextId = localHomepageImages.length > 0 ? Math.max(...localHomepageImages.map(i => i.id)) + 1 : 1;
    const newImage: HomepageImage = {
      id: nextId,
      file_path: image.file_path,
      external_url: image.external_url,
      source_type: image.source_type,
      track: image.track,
      project_id: image.project_id || null,
      display_order: nextOrder,
      created_at: new Date(),
      updated_at: new Date(),
    };
    localHomepageImages.push(newImage);
    return newImage;
  }

  async updateHomepageImage(id: number, data: Partial<HomepageImage>): Promise<HomepageImage | null> {
    if (isDatabaseConnected()) {
      try {
        await execute(
          'UPDATE homepage_images SET project_id = ?, track = COALESCE(?, track), display_order = COALESCE(?, display_order), updated_at = NOW() WHERE id = ?',
          [data.project_id !== undefined ? data.project_id : null, data.track || null, data.display_order || null, id]
        );
      } catch (e) {
        console.warn('[SettingsRepository] DB update failed for homepage image:', e);
      }
    }

    const item = localHomepageImages.find(img => img.id === id);
    if (item) {
      if (data.project_id !== undefined) item.project_id = data.project_id;
      if (data.track) item.track = data.track;
      if (data.display_order !== undefined) item.display_order = data.display_order;
      item.updated_at = new Date();
      return item;
    }
    return null;
  }

  async reorderHomepageImages(track: TrackType, orderedIds: number[]): Promise<HomepageImage[]> {
    if (isDatabaseConnected()) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          await execute('UPDATE homepage_images SET display_order = ?, updated_at = NOW() WHERE id = ? AND track = ?', [i + 1, orderedIds[i], track]);
        }
      } catch (e) {
        console.warn('[SettingsRepository] DB reorder failed for homepage images:', e);
      }
    }

    orderedIds.forEach((id, index) => {
      const item = localHomepageImages.find(img => img.id === id && img.track === track);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    return [...localHomepageImages.filter(img => img.track === track)].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteHomepageImage(id: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM homepage_images WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[SettingsRepository] Error deleting homepage image from DB:', e);
      }
    }

    const initialLength = localHomepageImages.length;
    localHomepageImages = localHomepageImages.filter(img => img.id !== id);
    return localHomepageImages.length < initialLength;
  }

  // ==========================================
  // Social Links
  // ==========================================
  async getSocialLinks(all: boolean = false): Promise<SocialLink[]> {
    if (isDatabaseConnected()) {
      try {
        const sql = all
          ? 'SELECT * FROM social_links ORDER BY display_order ASC, id ASC'
          : 'SELECT * FROM social_links WHERE is_active = TRUE ORDER BY display_order ASC, id ASC';
        return await query<SocialLink>(sql);
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to local store for social_links:', e);
      }
    }
    const filtered = all ? localSocialLinks : localSocialLinks.filter(l => l.is_active);
    return [...filtered].sort((a, b) => a.display_order - b.display_order);
  }

  async addSocialLink(link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>): Promise<SocialLink> {
    const nextOrder = link.display_order || (localSocialLinks.length > 0 ? Math.max(...localSocialLinks.map(l => l.display_order)) + 1 : 1);

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO social_links (platform_key, label, url, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [link.platform_key, link.label, link.url, nextOrder, link.is_active ?? true]
        );
        const created: SocialLink = {
          id: res.insertId,
          platform_key: link.platform_key,
          label: link.label,
          url: link.url,
          display_order: nextOrder,
          is_active: link.is_active ?? true,
          created_at: new Date(),
          updated_at: new Date(),
        };
        localSocialLinks.push(created);
        return created;
      } catch (e) {
        console.warn('[SettingsRepository] DB insert failed for social link:', e);
      }
    }

    const nextId = localSocialLinks.length > 0 ? Math.max(...localSocialLinks.map(l => l.id)) + 1 : 1;
    const newLink: SocialLink = {
      id: nextId,
      platform_key: link.platform_key,
      label: link.label,
      url: link.url,
      display_order: nextOrder,
      is_active: link.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    localSocialLinks.push(newLink);
    return newLink;
  }

  async updateSocialLink(id: number, data: Partial<SocialLink>): Promise<SocialLink | null> {
    if (isDatabaseConnected()) {
      try {
        const current = localSocialLinks.find(l => l.id === id);
        if (current) {
          await execute(
            'UPDATE social_links SET platform_key = ?, label = ?, url = ?, is_active = ?, display_order = ?, updated_at = NOW() WHERE id = ?',
            [
              data.platform_key ?? current.platform_key,
              data.label ?? current.label,
              data.url ?? current.url,
              data.is_active ?? current.is_active,
              data.display_order ?? current.display_order,
              id,
            ]
          );
        }
      } catch (e) {
        console.warn('[SettingsRepository] DB update failed for social link:', e);
      }
    }

    const item = localSocialLinks.find(l => l.id === id);
    if (item) {
      if (data.platform_key) item.platform_key = data.platform_key;
      if (data.label) item.label = data.label;
      if (data.url) item.url = data.url;
      if (data.is_active !== undefined) item.is_active = data.is_active;
      if (data.display_order !== undefined) item.display_order = data.display_order;
      item.updated_at = new Date();
      return item;
    }
    return null;
  }

  async reorderSocialLinks(orderedIds: number[]): Promise<SocialLink[]> {
    if (isDatabaseConnected()) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          await execute('UPDATE social_links SET display_order = ?, updated_at = NOW() WHERE id = ?', [i + 1, orderedIds[i]]);
        }
      } catch (e) {
        console.warn('[SettingsRepository] DB reorder failed for social links:', e);
      }
    }

    orderedIds.forEach((id, index) => {
      const item = localSocialLinks.find(l => l.id === id);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    return [...localSocialLinks].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteSocialLink(id: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM social_links WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[SettingsRepository] Error deleting social link from DB:', e);
      }
    }

    const initialLength = localSocialLinks.length;
    localSocialLinks = localSocialLinks.filter(l => l.id !== id);
    return localSocialLinks.length < initialLength;
  }

  // ==========================================
  // Footer Settings
  // ==========================================
  async getFooterSettings(): Promise<FooterSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<FooterSettings>('SELECT * FROM footer_settings LIMIT 1');
        if (rows[0]) return rows[0];
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to local store for footer_settings:', e);
      }
    }
    return localFooterSettings;
  }

  async updateFooterSettings(data: Partial<FooterSettings>): Promise<FooterSettings> {
    if (isDatabaseConnected()) {
      try {
        const current = await this.getFooterSettings();
        await execute(
          `UPDATE footer_settings SET 
            copyright_text = ?, 
            designer_label = ?, 
            designer_name = ?, 
            designer_url = ?, 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            data.copyright_text ?? current.copyright_text,
            data.designer_label ?? current.designer_label,
            data.designer_name ?? current.designer_name,
            data.designer_url ?? current.designer_url,
            current.id || 1,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] Error updating footer_settings in DB:', e);
      }
    }

    localFooterSettings = {
      ...localFooterSettings,
      ...data,
      updated_at: new Date(),
    };
    return localFooterSettings;
  }
}

export const settingsRepository = new SettingsRepository();
