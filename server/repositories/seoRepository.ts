import { GlobalSeoSettings, SeoLocation } from '../models/Seo';
import { isDatabaseConnected, query, execute } from '../database/db';
import { PersistentStore } from '../database/persistentStore';

export class SeoRepository {
  async getGlobalSeo(): Promise<GlobalSeoSettings> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<GlobalSeoSettings>(
          'SELECT id, site_title, meta_description, primary_keywords, secondary_keywords, canonical_url, og_title, og_description, og_image_url, google_site_verification, robots_indexing, schema_type, created_at, updated_at FROM seo_settings LIMIT 1'
        );
        if (rows && rows[0]) {
          const store = PersistentStore.getStore();
          store.globalSeo = rows[0];
          PersistentStore.saveStore();
          return rows[0];
        }
      } catch (e) {
        console.warn('[SeoRepository] DB error in getGlobalSeo, falling back to persistent store:', e);
      }
    }

    const store = PersistentStore.getStore();
    return store.globalSeo;
  }

  async updateGlobalSeo(data: Partial<GlobalSeoSettings>): Promise<GlobalSeoSettings> {
    const store = PersistentStore.getStore();
    const current = store.globalSeo;

    if (isDatabaseConnected()) {
      try {
        await execute(
          `UPDATE seo_settings SET 
            site_title = COALESCE(?, site_title), 
            meta_description = COALESCE(?, meta_description), 
            primary_keywords = COALESCE(?, primary_keywords), 
            secondary_keywords = COALESCE(?, secondary_keywords), 
            canonical_url = COALESCE(?, canonical_url), 
            og_title = COALESCE(?, og_title), 
            og_description = COALESCE(?, og_description), 
            og_image_url = COALESCE(?, og_image_url), 
            google_site_verification = COALESCE(?, google_site_verification), 
            robots_indexing = COALESCE(?, robots_indexing), 
            schema_type = COALESCE(?, schema_type), 
            updated_at = NOW() 
          WHERE id = 1`,
          [
            data.site_title ?? current.site_title,
            data.meta_description ?? current.meta_description,
            data.primary_keywords ?? current.primary_keywords,
            data.secondary_keywords ?? current.secondary_keywords,
            data.canonical_url ?? current.canonical_url,
            data.og_title ?? current.og_title,
            data.og_description ?? current.og_description,
            data.og_image_url !== undefined ? data.og_image_url : current.og_image_url,
            data.google_site_verification !== undefined ? data.google_site_verification : current.google_site_verification,
            data.robots_indexing !== undefined ? (data.robots_indexing ? 1 : 0) : (current.robots_indexing ? 1 : 0),
            data.schema_type ?? current.schema_type,
          ]
        );
      } catch (e) {
        console.warn('[SeoRepository] DB error in updateGlobalSeo:', e);
      }
    }

    if (data.site_title !== undefined) current.site_title = data.site_title;
    if (data.meta_description !== undefined) current.meta_description = data.meta_description;
    if (data.primary_keywords !== undefined) current.primary_keywords = data.primary_keywords;
    if (data.secondary_keywords !== undefined) current.secondary_keywords = data.secondary_keywords;
    if (data.canonical_url !== undefined) current.canonical_url = data.canonical_url;
    if (data.og_title !== undefined) current.og_title = data.og_title;
    if (data.og_description !== undefined) current.og_description = data.og_description;
    if (data.og_image_url !== undefined) current.og_image_url = data.og_image_url;
    if (data.google_site_verification !== undefined) current.google_site_verification = data.google_site_verification;
    if (data.robots_indexing !== undefined) current.robots_indexing = Boolean(data.robots_indexing);
    if (data.schema_type !== undefined) current.schema_type = data.schema_type;
    current.updated_at = new Date();

    PersistentStore.saveStore();
    return current;
  }

  async getAllLocations(): Promise<SeoLocation[]> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<SeoLocation>(
          'SELECT id, location_name, state, url_slug, seo_title, meta_description, primary_keyword, secondary_keywords, location_content, services_offered, og_title, og_description, og_image_url, canonical_url, is_published, is_indexable, sitemap_priority, created_at, updated_at FROM seo_locations ORDER BY state ASC, location_name ASC'
        );
        if (rows && rows.length > 0) {
          const store = PersistentStore.getStore();
          store.seoLocations = rows;
          PersistentStore.saveStore();
          return rows;
        }
      } catch (e) {
        console.warn('[SeoRepository] DB error in getAllLocations, falling back to persistent store:', e);
      }
    }

    const store = PersistentStore.getStore();
    return store.seoLocations;
  }

  async getPublishedLocations(): Promise<SeoLocation[]> {
    const all = await this.getAllLocations();
    return all.filter((loc) => loc.is_published);
  }

  async getLocationBySlug(slug: string): Promise<SeoLocation | null> {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();

    if (isDatabaseConnected()) {
      try {
        const rows = await query<SeoLocation>(
          'SELECT id, location_name, state, url_slug, seo_title, meta_description, primary_keyword, secondary_keywords, location_content, services_offered, og_title, og_description, og_image_url, canonical_url, is_published, is_indexable, sitemap_priority, created_at, updated_at FROM seo_locations WHERE url_slug = ? LIMIT 1',
          [cleanSlug]
        );
        if (rows && rows[0]) {
          return rows[0];
        }
      } catch (e) {
        console.warn('[SeoRepository] DB error in getLocationBySlug:', e);
      }
    }

    const store = PersistentStore.getStore();
    const found = store.seoLocations.find(
      (loc) => loc.url_slug.toLowerCase() === cleanSlug || loc.url_slug.toLowerCase() === `photographer-in-${cleanSlug}`
    );
    return found || null;
  }

  async getLocationById(id: number): Promise<SeoLocation | null> {
    const store = PersistentStore.getStore();
    const found = store.seoLocations.find((loc) => loc.id === id);
    return found || null;
  }

  async createLocation(data: Omit<SeoLocation, 'id' | 'created_at' | 'updated_at'>): Promise<SeoLocation> {
    const store = PersistentStore.getStore();
    let newId = store.seoLocations.length > 0 ? Math.max(...store.seoLocations.map((l) => l.id)) + 1 : 1;

    let slug = data.url_slug ? data.url_slug.trim().toLowerCase() : `photographer-in-${data.location_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (!slug.startsWith('photographer-in-') && !slug.includes('/')) {
      slug = `photographer-in-${slug}`;
    }

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          `INSERT INTO seo_locations (
            location_name, state, url_slug, seo_title, meta_description, 
            primary_keyword, secondary_keywords, location_content, services_offered, 
            og_title, og_description, og_image_url, is_published, is_indexable, 
            sitemap_priority, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            data.location_name,
            data.state,
            slug,
            data.seo_title,
            data.meta_description,
            data.primary_keyword,
            data.secondary_keywords,
            data.location_content,
            data.services_offered,
            data.og_title || data.seo_title,
            data.og_description || data.meta_description,
            data.og_image_url || null,
            data.is_published ? 1 : 0,
            data.is_indexable ? 1 : 0,
            data.sitemap_priority || 0.8,
          ]
        );
        if (res?.insertId) {
          newId = res.insertId;
        }
      } catch (e) {
        console.warn('[SeoRepository] DB insert failed for seo_location:', e);
      }
    }

    const created: SeoLocation = {
      id: newId,
      location_name: data.location_name,
      state: data.state,
      url_slug: slug,
      seo_title: data.seo_title,
      meta_description: data.meta_description,
      primary_keyword: data.primary_keyword,
      secondary_keywords: data.secondary_keywords,
      location_content: data.location_content,
      services_offered: data.services_offered,
      related_projects: data.related_projects || [1, 2],
      og_title: data.og_title || data.seo_title,
      og_description: data.og_description || data.meta_description,
      og_image_url: data.og_image_url || null,
      canonical_url: data.canonical_url,
      is_published: data.is_published !== false,
      is_indexable: data.is_indexable !== false,
      sitemap_priority: data.sitemap_priority || 0.8,
      created_at: new Date(),
      updated_at: new Date(),
    };

    store.seoLocations.push(created);
    PersistentStore.saveStore();
    return created;
  }

  async updateLocation(id: number, data: Partial<SeoLocation>): Promise<SeoLocation | null> {
    const store = PersistentStore.getStore();
    const current = store.seoLocations.find((l) => l.id === id);
    if (!current) return null;

    if (isDatabaseConnected()) {
      try {
        await execute(
          `UPDATE seo_locations SET 
            location_name = COALESCE(?, location_name), 
            state = COALESCE(?, state), 
            url_slug = COALESCE(?, url_slug), 
            seo_title = COALESCE(?, seo_title), 
            meta_description = COALESCE(?, meta_description), 
            primary_keyword = COALESCE(?, primary_keyword), 
            secondary_keywords = COALESCE(?, secondary_keywords), 
            location_content = COALESCE(?, location_content), 
            services_offered = COALESCE(?, services_offered), 
            og_title = COALESCE(?, og_title), 
            og_description = COALESCE(?, og_description), 
            og_image_url = COALESCE(?, og_image_url), 
            is_published = COALESCE(?, is_published), 
            is_indexable = COALESCE(?, is_indexable), 
            sitemap_priority = COALESCE(?, sitemap_priority), 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            data.location_name ?? current.location_name,
            data.state ?? current.state,
            data.url_slug ?? current.url_slug,
            data.seo_title ?? current.seo_title,
            data.meta_description ?? current.meta_description,
            data.primary_keyword ?? current.primary_keyword,
            data.secondary_keywords ?? current.secondary_keywords,
            data.location_content ?? current.location_content,
            data.services_offered ?? current.services_offered,
            data.og_title ?? current.og_title,
            data.og_description ?? current.og_description,
            data.og_image_url !== undefined ? data.og_image_url : current.og_image_url,
            data.is_published !== undefined ? (data.is_published ? 1 : 0) : (current.is_published ? 1 : 0),
            data.is_indexable !== undefined ? (data.is_indexable ? 1 : 0) : (current.is_indexable ? 1 : 0),
            data.sitemap_priority ?? current.sitemap_priority,
            id,
          ]
        );
      } catch (e) {
        console.warn('[SeoRepository] DB update failed for seo_location:', e);
      }
    }

    if (data.location_name !== undefined) current.location_name = data.location_name;
    if (data.state !== undefined) current.state = data.state;
    if (data.url_slug !== undefined) current.url_slug = data.url_slug;
    if (data.seo_title !== undefined) current.seo_title = data.seo_title;
    if (data.meta_description !== undefined) current.meta_description = data.meta_description;
    if (data.primary_keyword !== undefined) current.primary_keyword = data.primary_keyword;
    if (data.secondary_keywords !== undefined) current.secondary_keywords = data.secondary_keywords;
    if (data.location_content !== undefined) current.location_content = data.location_content;
    if (data.services_offered !== undefined) current.services_offered = data.services_offered;
    if (data.og_title !== undefined) current.og_title = data.og_title;
    if (data.og_description !== undefined) current.og_description = data.og_description;
    if (data.og_image_url !== undefined) current.og_image_url = data.og_image_url;
    if (data.is_published !== undefined) current.is_published = Boolean(data.is_published);
    if (data.is_indexable !== undefined) current.is_indexable = Boolean(data.is_indexable);
    if (data.sitemap_priority !== undefined) current.sitemap_priority = Number(data.sitemap_priority);
    current.updated_at = new Date();

    PersistentStore.saveStore();
    return current;
  }

  async deleteLocation(id: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM seo_locations WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[SeoRepository] DB delete failed for seo_location:', e);
      }
    }

    const store = PersistentStore.getStore();
    const initialLen = store.seoLocations.length;
    store.seoLocations = store.seoLocations.filter((l) => l.id !== id);
    PersistentStore.saveStore();
    return store.seoLocations.length < initialLen;
  }
}

export const seoRepository = new SeoRepository();
