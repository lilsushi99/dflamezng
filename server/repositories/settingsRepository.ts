import { SiteSettings, SocialLink, FooterSettings } from '../models/Settings';
import { SplashSettings, SplashImage } from '../models/Splash';
import { HomepageSettings, HomepageImage, TrackType } from '../models/Homepage';
import { isDatabaseConnected, query, execute } from '../database/db';
import { PersistentStore } from '../database/persistentStore';
import { defaultHomepageSettings } from '../database/seedData';
import { deleteStoredFile } from '../config/storage';

function stripUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as Array<keyof T>) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

export class SettingsRepository {
  // ==========================================
  // Site Settings
  // ==========================================
  async getSiteSettings(): Promise<SiteSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<SiteSettings>('SELECT * FROM site_settings LIMIT 1');
        if (rows[0]) {
          const store = PersistentStore.getStore();
          store.siteSettings = { ...store.siteSettings, ...rows[0] };
          PersistentStore.saveStore();
          return rows[0];
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to persistent store for site_settings:', e);
      }
    }
    return PersistentStore.getStore().siteSettings;
  }

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const store = PersistentStore.getStore();
    const current = store.siteSettings;

    if (isDatabaseConnected()) {
      try {
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
            about_title = ?,
            about_statement = ?,
            about_story = ?,
            about_services = ?,
            projects_modal_subtitle = ?,
            projects_modal_title = ?,
            projects_modal_archive_label = ?,
            booking_page_subtext = ?,
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
            data.about_title !== undefined ? data.about_title : current.about_title,
            data.about_statement !== undefined ? data.about_statement : current.about_statement,
            data.about_story !== undefined ? data.about_story : current.about_story,
            data.about_services !== undefined ? data.about_services : current.about_services,
            data.projects_modal_subtitle !== undefined ? data.projects_modal_subtitle : current.projects_modal_subtitle,
            data.projects_modal_title !== undefined ? data.projects_modal_title : current.projects_modal_title,
            data.projects_modal_archive_label !== undefined ? data.projects_modal_archive_label : current.projects_modal_archive_label,
            data.booking_page_subtext !== undefined ? data.booking_page_subtext : current.booking_page_subtext,
            current.id || 1,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] Error executing DB update for site_settings:', e);
        throw e;
      }
    }

    store.siteSettings = {
      ...current,
      ...data,
      updated_at: new Date(),
    };
    PersistentStore.saveStore();
    return store.siteSettings;
  }

  // ==========================================
  // Splash Settings & Images
  // ==========================================
  async getSplashSettings(): Promise<SplashSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<SplashSettings>('SELECT * FROM splash_settings LIMIT 1');
        if (rows[0]) {
          const store = PersistentStore.getStore();
          store.splashSettings = { ...store.splashSettings, ...rows[0] };
          PersistentStore.saveStore();
          return store.splashSettings;
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to persistent store for splash_settings:', e);
      }
    }
    return PersistentStore.getStore().splashSettings;
  }

  async updateSplashSettings(data: Partial<SplashSettings>): Promise<SplashSettings> {
    const store = PersistentStore.getStore();
    const current = store.splashSettings;

    if (isDatabaseConnected()) {
      try {
        await execute(
          `UPDATE splash_settings SET 
            is_enabled = ?, 
            signature_text = ?, 
            photographer_name = ?,
            splash_subtext = ?,
            typewriter_enabled = ?,
            typing_speed_ms = ?, 
            stack_duration_ms = ?, 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            data.is_enabled ?? current.is_enabled,
            data.signature_text ?? current.signature_text,
            data.photographer_name ?? current.photographer_name,
            data.splash_subtext ?? current.splash_subtext,
            data.typewriter_enabled ?? current.typewriter_enabled,
            data.typing_speed_ms ?? current.typing_speed_ms,
            data.stack_duration_ms ?? current.stack_duration_ms,
            current.id || 1,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] Error executing DB update for splash_settings:', e);
        throw e;
      }
    }

    store.splashSettings = {
      ...current,
      ...data,
      updated_at: new Date(),
    };
    PersistentStore.saveStore();
    return store.splashSettings;
  }

  async getSplashImages(): Promise<SplashImage[]> {
    if (isDatabaseConnected()) {
      try {
        const dbImages = await query<SplashImage>('SELECT * FROM splash_images ORDER BY display_order ASC, id ASC');
        if (dbImages) {
          const store = PersistentStore.getStore();
          store.splashImages = dbImages;
          PersistentStore.saveStore();
          return dbImages;
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to persistent store for splash_images:', e);
      }
    }
    return [...PersistentStore.getStore().splashImages].sort((a, b) => a.display_order - b.display_order);
  }

  async addSplashImage(image: Omit<SplashImage, 'id' | 'created_at' | 'updated_at'>): Promise<SplashImage> {
    const store = PersistentStore.getStore();
    const nextOrder = image.display_order || (store.splashImages.length > 0 ? Math.max(...store.splashImages.map(i => i.display_order)) + 1 : 1);
    
    let newId = store.splashImages.length > 0 ? Math.max(...store.splashImages.map(i => i.id)) + 1 : 1;

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO splash_images (file_path, external_url, source_type, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [image.file_path, image.external_url, image.source_type, nextOrder]
        );
        if (res?.insertId) {
          newId = res.insertId;
        }
      } catch (e) {
        console.warn('[SettingsRepository] DB insert failed for splash image, using persistent storage:', e);
        throw e;
      }
    }

    const createdImage: SplashImage = {
      id: newId,
      file_path: image.file_path,
      external_url: image.external_url,
      source_type: image.source_type,
      display_order: nextOrder,
      created_at: new Date(),
      updated_at: new Date(),
    };

    store.splashImages.push(createdImage);
    PersistentStore.saveStore();
    return createdImage;
  }

  async updateSplashImage(id: number, data: Partial<SplashImage>): Promise<SplashImage | null> {
    if (isDatabaseConnected()) {
      try {
        await execute(
          'UPDATE splash_images SET display_order = COALESCE(?, display_order), updated_at = NOW() WHERE id = ?',
          [data.display_order ?? null, id]
        );
      } catch (e) {
        console.warn('[SettingsRepository] DB update failed for splash image:', e);
        throw e;
      }
    }

    const store = PersistentStore.getStore();
    const item = store.splashImages.find(img => img.id === id);
    if (item) {
      if (data.display_order !== undefined) item.display_order = data.display_order;
      item.updated_at = new Date();
      PersistentStore.saveStore();
      return item;
    }
    return null;
  }

  async reorderSplashImages(orderedIds: number[]): Promise<SplashImage[]> {
    if (isDatabaseConnected()) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          await execute('UPDATE splash_images SET display_order = ?, updated_at = NOW() WHERE id = ?', [i + 1, orderedIds[i]]);
        }
      } catch (e) {
        console.warn('[SettingsRepository] Error reordering splash images in DB:', e);
        throw e;
      }
    }

    const store = PersistentStore.getStore();
    orderedIds.forEach((id, index) => {
      const item = store.splashImages.find(img => img.id === id);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    PersistentStore.saveStore();
    return [...store.splashImages].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteSplashImage(id: number): Promise<boolean> {
    const store = PersistentStore.getStore();
    const target = store.splashImages.find((img) => img.id === id);

    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM splash_images WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[SettingsRepository] Error deleting splash image from DB:', e);
        throw e;
      }
    }

    if (target?.source_type === 'local') {
      deleteStoredFile(target.file_path);
    }

    const initialLength = store.splashImages.length;
    store.splashImages = store.splashImages.filter(img => img.id !== id);
    PersistentStore.saveStore();
    return store.splashImages.length < initialLength;
  }

  // ==========================================
  // Homepage Settings & Images
  // ==========================================
  async getHomepageSettings(): Promise<HomepageSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<HomepageSettings>('SELECT * FROM homepage_settings LIMIT 1');
        if (rows[0]) {
          const store = PersistentStore.getStore();
          store.homepageSettings = { ...defaultHomepageSettings, ...store.homepageSettings, ...rows[0] };
          PersistentStore.saveStore();
          return store.homepageSettings;
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to persistent store for homepage_settings:', e);
      }
    }
    const store = PersistentStore.getStore();
    return { ...defaultHomepageSettings, ...(store.homepageSettings || {}) };
  }

  async updateHomepageSettings(data: Partial<HomepageSettings>): Promise<HomepageSettings> {
    const store = PersistentStore.getStore();
    const current = { ...defaultHomepageSettings, ...(store.homepageSettings || {}) };
    const cleaned = stripUndefined(data);

    if (isDatabaseConnected()) {
      try {
        await execute(
          `UPDATE homepage_settings SET 
            logo_type = ?,
            navbar_logo_text = ?,
            logo_image_path = ?,
            navbar_projects_label = ?,
            navbar_contact_label = ?,
            theme_toggle_visible = ?,
            theme_mode = ?,
            photographer_name = ?,
            main_text_case = ?,
            subtext_case = ?,
            top_track_speed = ?, 
            bottom_track_speed = ?, 
            hero_subtext = ?, 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            cleaned.logo_type ?? current.logo_type ?? 'TEXT',
            cleaned.navbar_logo_text ?? current.navbar_logo_text,
            cleaned.logo_image_path !== undefined ? cleaned.logo_image_path : current.logo_image_path,
            cleaned.navbar_projects_label ?? current.navbar_projects_label,
            cleaned.navbar_contact_label ?? current.navbar_contact_label,
            cleaned.theme_toggle_visible ?? current.theme_toggle_visible,
            cleaned.theme_mode ?? current.theme_mode ?? 'LIGHT',
            cleaned.photographer_name ?? current.photographer_name,
            cleaned.main_text_case ?? current.main_text_case ?? 'as_written',
            cleaned.subtext_case ?? current.subtext_case ?? 'as_written',
            cleaned.top_track_speed ?? current.top_track_speed,
            cleaned.bottom_track_speed ?? current.bottom_track_speed,
            cleaned.hero_subtext ?? current.hero_subtext,
            current.id || 1,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] Error executing DB update for homepage_settings:', e);
        throw e;
      }
    }

    store.homepageSettings = {
      ...current,
      ...cleaned,
      updated_at: new Date(),
    };
    PersistentStore.saveStore();
    return store.homepageSettings;
  }

  async getHomepageImages(track?: TrackType): Promise<HomepageImage[]> {
    if (isDatabaseConnected()) {
      try {
        const sql = track
          ? 'SELECT * FROM homepage_images WHERE track = ? ORDER BY display_order ASC, id ASC'
          : 'SELECT * FROM homepage_images ORDER BY track ASC, display_order ASC, id ASC';
        const params = track ? [track] : [];
        const rows = await query<HomepageImage>(sql, params);
        if (rows) {
          return rows;
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to persistent store for homepage_images:', e);
      }
    }

    const store = PersistentStore.getStore();
    if (track) {
      return [...store.homepageImages.filter(img => img.track === track)].sort((a, b) => a.display_order - b.display_order);
    }
    return [...store.homepageImages].sort((a, b) => a.display_order - b.display_order);
  }

  async addHomepageImage(image: Omit<HomepageImage, 'id' | 'created_at' | 'updated_at'>): Promise<HomepageImage> {
    const store = PersistentStore.getStore();
    const existing = store.homepageImages.filter(i => i.track === image.track);
    const nextOrder = image.display_order || (existing.length > 0 ? Math.max(...existing.map(i => i.display_order)) + 1 : 1);
    let newId = store.homepageImages.length > 0 ? Math.max(...store.homepageImages.map(i => i.id)) + 1 : 1;

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO homepage_images (file_path, external_url, source_type, track, project_id, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [image.file_path, image.external_url, image.source_type, image.track, image.project_id || null, nextOrder]
        );
        if (res?.insertId) {
          newId = res.insertId;
        }
      } catch (e) {
        console.warn('[SettingsRepository] DB insert failed for homepage image:', e);
        throw e;
      }
    }

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

    store.homepageImages.push(createdImage);
    PersistentStore.saveStore();
    return createdImage;
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
        throw e;
      }
    }

    const store = PersistentStore.getStore();
    const item = store.homepageImages.find(img => img.id === id);
    if (item) {
      if (data.project_id !== undefined) item.project_id = data.project_id;
      if (data.track) item.track = data.track;
      if (data.display_order !== undefined) item.display_order = data.display_order;
      item.updated_at = new Date();
      PersistentStore.saveStore();
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
        throw e;
      }
    }

    const store = PersistentStore.getStore();
    orderedIds.forEach((id, index) => {
      const item = store.homepageImages.find(img => img.id === id && img.track === track);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    PersistentStore.saveStore();
    return [...store.homepageImages.filter(img => img.track === track)].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteHomepageImage(id: number): Promise<boolean> {
    const store = PersistentStore.getStore();
    const target = store.homepageImages.find((img) => img.id === id);

    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM homepage_images WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[SettingsRepository] Error deleting homepage image from DB:', e);
        throw e;
      }
    }

    if (target?.source_type === 'local') {
      deleteStoredFile(target.file_path);
    }

    const initialLength = store.homepageImages.length;
    store.homepageImages = store.homepageImages.filter(img => img.id !== id);
    PersistentStore.saveStore();
    return store.homepageImages.length < initialLength;
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
        const rows = await query<SocialLink>(sql);
        if (rows) {
          return rows;
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to persistent store for social_links:', e);
      }
    }

    const store = PersistentStore.getStore();
    const filtered = all ? store.socialLinks : store.socialLinks.filter(l => l.is_active);
    return [...filtered].sort((a, b) => a.display_order - b.display_order);
  }

  async addSocialLink(link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>): Promise<SocialLink> {
    const store = PersistentStore.getStore();
    const nextOrder = link.display_order || (store.socialLinks.length > 0 ? Math.max(...store.socialLinks.map(l => l.display_order)) + 1 : 1);
    let newId = store.socialLinks.length > 0 ? Math.max(...store.socialLinks.map(l => l.id)) + 1 : 1;

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO social_links (platform_key, label, url, display_mode, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [link.platform_key, link.label, link.url, link.display_mode || 'TEXT', nextOrder, link.is_active ?? true]
        );
        if (res?.insertId) {
          newId = res.insertId;
        }
      } catch (e) {
        console.warn('[SettingsRepository] DB insert failed for social link:', e);
        throw e;
      }
    }

    const created: SocialLink = {
      id: newId,
      platform_key: link.platform_key,
      label: link.label,
      url: link.url,
      display_mode: link.display_mode || 'TEXT',
      display_order: nextOrder,
      is_active: link.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    store.socialLinks.push(created);
    PersistentStore.saveStore();
    return created;
  }

  async updateSocialLink(id: number, data: Partial<SocialLink>): Promise<SocialLink | null> {
    const store = PersistentStore.getStore();
    const current = store.socialLinks.find(l => l.id === id);

    if (isDatabaseConnected() && current) {
      try {
        await execute(
          'UPDATE social_links SET platform_key = ?, label = ?, url = ?, display_mode = ?, is_active = ?, display_order = ?, updated_at = NOW() WHERE id = ?',
          [
            data.platform_key ?? current.platform_key,
            data.label ?? current.label,
            data.url ?? current.url,
            data.display_mode ?? current.display_mode ?? 'TEXT',
            data.is_active ?? current.is_active,
            data.display_order ?? current.display_order,
            id,
          ]
        );
      } catch (e) {
        console.warn('[SettingsRepository] DB update failed for social link:', e);
        throw e;
      }
    }

    if (current) {
      if (data.platform_key) current.platform_key = data.platform_key;
      if (data.label) current.label = data.label;
      if (data.url) current.url = data.url;
      if (data.display_mode) current.display_mode = data.display_mode;
      if (data.is_active !== undefined) current.is_active = data.is_active;
      if (data.display_order !== undefined) current.display_order = data.display_order;
      current.updated_at = new Date();
      PersistentStore.saveStore();
      return current;
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
        throw e;
      }
    }

    const store = PersistentStore.getStore();
    orderedIds.forEach((id, index) => {
      const item = store.socialLinks.find(l => l.id === id);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    PersistentStore.saveStore();
    return [...store.socialLinks].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteSocialLink(id: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM social_links WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[SettingsRepository] Error deleting social link from DB:', e);
        throw e;
      }
    }

    const store = PersistentStore.getStore();
    const initialLength = store.socialLinks.length;
    store.socialLinks = store.socialLinks.filter(l => l.id !== id);
    PersistentStore.saveStore();
    return store.socialLinks.length < initialLength;
  }

  // ==========================================
  // Footer Settings
  // ==========================================
  async getFooterSettings(): Promise<FooterSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<FooterSettings>('SELECT * FROM footer_settings LIMIT 1');
        if (rows[0]) {
          const store = PersistentStore.getStore();
          store.footerSettings = { ...store.footerSettings, ...rows[0] };
          PersistentStore.saveStore();
          return rows[0];
        }
      } catch (e) {
        console.warn('[SettingsRepository] Falling back to persistent store for footer_settings:', e);
      }
    }
    return PersistentStore.getStore().footerSettings;
  }

  async updateFooterSettings(data: Partial<FooterSettings>): Promise<FooterSettings> {
    const store = PersistentStore.getStore();
    const current = store.footerSettings;

    if (isDatabaseConnected()) {
      try {
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
        throw e;
      }
    }

    store.footerSettings = {
      ...current,
      ...data,
      updated_at: new Date(),
    };
    PersistentStore.saveStore();
    return store.footerSettings;
  }
}

export const settingsRepository = new SettingsRepository();
