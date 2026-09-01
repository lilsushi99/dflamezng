import { Project, ProjectImage } from '../models/Project';
import { isDatabaseConnected, query, execute } from '../database/db';
import { PersistentStore } from '../database/persistentStore';

export class ProjectRepository {
  async findAll(): Promise<Project[]> {
    if (isDatabaseConnected()) {
      try {
        const projects = await query<Project>(
          'SELECT id, name, subtext, year, category, story, created_at, updated_at FROM projects ORDER BY id ASC'
        );
        const images = await query<ProjectImage>(
          'SELECT id, project_id, file_path, external_url, source_type, display_order, created_at, updated_at FROM project_images ORDER BY display_order ASC, id ASC'
        );

        if (projects) {
          const store = PersistentStore.getStore();
          store.projects = projects;
          store.projectImages = images || [];
          PersistentStore.saveStore();
          return projects.map((p) => ({
            ...p,
            images: images.filter((img) => img.project_id === p.id),
          }));
        }
      } catch (e) {
        console.warn('[ProjectRepository] Falling back to persistent store for findAll:', e);
      }
    }

    const store = PersistentStore.getStore();
    return store.projects.map((p) => ({
      ...p,
      images: [...store.projectImages.filter((img) => img.project_id === p.id)].sort((a, b) => a.display_order - b.display_order),
    }));
  }

  async findById(id: number): Promise<Project | null> {
    if (isDatabaseConnected()) {
      try {
        const projects = await query<Project>(
          'SELECT id, name, subtext, year, category, story, created_at, updated_at FROM projects WHERE id = ? LIMIT 1',
          [id]
        );
        if (projects[0]) {
          const images = await query<ProjectImage>(
            'SELECT id, project_id, file_path, external_url, source_type, display_order, created_at, updated_at FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
            [id]
          );

          return {
            ...projects[0],
            images: images || [],
          };
        }
      } catch (e) {
        console.warn('[ProjectRepository] Falling back to persistent store for findById:', e);
      }
    }

    const store = PersistentStore.getStore();
    const project = store.projects.find((p) => p.id === id);
    if (!project) return null;

    return {
      ...project,
      images: [...store.projectImages.filter((img) => img.project_id === id)].sort((a, b) => a.display_order - b.display_order),
    };
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | null> {
    const store = PersistentStore.getStore();
    const current = store.projects.find((p) => p.id === id);

    if (isDatabaseConnected() && current) {
      try {
        await execute(
          `UPDATE projects SET 
            name = COALESCE(?, name), 
            subtext = COALESCE(?, subtext), 
            year = COALESCE(?, year), 
            category = COALESCE(?, category), 
            story = COALESCE(?, story), 
            updated_at = NOW() 
          WHERE id = ?`,
          [
            data.name ?? current.name,
            data.subtext !== undefined ? data.subtext : current.subtext,
            data.year ?? current.year,
            data.category ?? current.category,
            data.story !== undefined ? data.story : current.story,
            id,
          ]
        );
      } catch (e) {
        console.warn('[ProjectRepository] DB update failed for project:', e);
      }
    }

    if (current) {
      if (data.name !== undefined) current.name = data.name;
      if (data.subtext !== undefined) current.subtext = data.subtext;
      if (data.year !== undefined) current.year = data.year;
      if (data.category !== undefined) current.category = data.category;
      if (data.story !== undefined) current.story = data.story;
      current.updated_at = new Date();
      PersistentStore.saveStore();
      return this.findById(id);
    }
    return null;
  }

  async findImagesByProjectId(projectId: number): Promise<ProjectImage[]> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<ProjectImage>(
          'SELECT id, project_id, file_path, external_url, source_type, display_order, created_at, updated_at FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
          [projectId]
        );
        if (rows) {
          return rows;
        }
      } catch (e) {
        console.warn('[ProjectRepository] Falling back to persistent store for findImagesByProjectId:', e);
      }
    }

    const store = PersistentStore.getStore();
    return [...store.projectImages.filter((img) => img.project_id === projectId)].sort((a, b) => a.display_order - b.display_order);
  }

  async addProjectImage(image: Omit<ProjectImage, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectImage> {
    const store = PersistentStore.getStore();
    const existing = store.projectImages.filter((i) => i.project_id === image.project_id);
    const nextOrder = image.display_order || (existing.length > 0 ? Math.max(...existing.map((i) => i.display_order)) + 1 : 1);
    let newId = store.projectImages.length > 0 ? Math.max(...store.projectImages.map((i) => i.id)) + 1 : 1;

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO project_images (project_id, file_path, external_url, source_type, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [image.project_id, image.file_path, image.external_url, image.source_type, nextOrder]
        );
        if (res?.insertId) {
          newId = res.insertId;
        }
      } catch (e) {
        console.warn('[ProjectRepository] DB insert failed for project image:', e);
      }
    }

    const createdImage: ProjectImage = {
      id: newId,
      project_id: image.project_id,
      file_path: image.file_path,
      external_url: image.external_url,
      source_type: image.source_type,
      display_order: nextOrder,
      created_at: new Date(),
      updated_at: new Date(),
    };

    store.projectImages.push(createdImage);
    PersistentStore.saveStore();
    return createdImage;
  }

  async reorderProjectImages(projectId: number, orderedIds: number[]): Promise<ProjectImage[]> {
    if (isDatabaseConnected()) {
      try {
        for (let i = 0; i < orderedIds.length; i++) {
          await execute('UPDATE project_images SET display_order = ?, updated_at = NOW() WHERE id = ? AND project_id = ?', [i + 1, orderedIds[i], projectId]);
        }
      } catch (e) {
        console.warn('[ProjectRepository] DB reorder failed for project images:', e);
      }
    }

    const store = PersistentStore.getStore();
    orderedIds.forEach((id, index) => {
      const item = store.projectImages.find((img) => img.id === id && img.project_id === projectId);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    PersistentStore.saveStore();
    return [...store.projectImages.filter((img) => img.project_id === projectId)].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteProjectImage(imageId: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM project_images WHERE id = ?', [imageId]);
      } catch (e) {
        console.warn('[ProjectRepository] DB delete failed for project image:', e);
      }
    }

    const store = PersistentStore.getStore();
    const initialLength = store.projectImages.length;
    store.projectImages = store.projectImages.filter((img) => img.id !== imageId);
    PersistentStore.saveStore();
    return store.projectImages.length < initialLength;
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const store = PersistentStore.getStore();
    const nextId = store.projects.length > 0 ? Math.max(...store.projects.map((p) => p.id)) + 1 : 1;

    let createdId = nextId;
    const now = new Date();

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO projects (name, subtext, year, category, story, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [
            data.name || `Project ${nextId}`,
            data.subtext || '',
            data.year || String(now.getFullYear()),
            data.category || 'PORTRAIT',
            data.story || '',
          ]
        );
        if (res?.insertId) {
          createdId = res.insertId;
        }
      } catch (e) {
        console.warn('[ProjectRepository] DB insert failed for project:', e);
      }
    }

    const newProject: Project = {
      id: createdId,
      name: data.name || `Project ${createdId}`,
      subtext: data.subtext || '',
      year: data.year || String(now.getFullYear()),
      category: data.category || 'PORTRAIT',
      story: data.story || '',
      created_at: now,
      updated_at: now,
      images: [],
    };

    store.projects.push(newProject);
    PersistentStore.saveStore();
    return newProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM project_images WHERE project_id = ?', [id]);
        await execute('DELETE FROM projects WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[ProjectRepository] DB delete failed for project:', e);
      }
    }

    const store = PersistentStore.getStore();
    store.projectImages = store.projectImages.filter((img) => img.project_id !== id);
    const initialLen = store.projects.length;
    store.projects = store.projects.filter((p) => p.id !== id);
    PersistentStore.saveStore();
    return store.projects.length < initialLen;
  }

  // ==========================================
  // CATEGORIES MANAGEMENT
  // ==========================================
  async findAllCategories(): Promise<any[]> {
    const store = PersistentStore.getStore();
    if (!store.categories || store.categories.length === 0) {
      store.categories = [
        { id: 1, name: 'Portrait', slug: 'portrait', description: 'Studio & Environmental Portraiture', display_order: 1, created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Fashion', slug: 'fashion', description: 'Contemporary Fashion Monographs', display_order: 2, created_at: new Date(), updated_at: new Date() },
        { id: 3, name: 'Editorial', slug: 'editorial', description: 'Magazine & Narrative Spreads', display_order: 3, created_at: new Date(), updated_at: new Date() },
        { id: 4, name: 'Afrocentric', slug: 'afrocentric', description: 'Traditional Textiles & Cultural Identity', display_order: 4, created_at: new Date(), updated_at: new Date() },
        { id: 5, name: 'Convocation', slug: 'convocation', description: 'Academic & Institutional Ceremonies', display_order: 5, created_at: new Date(), updated_at: new Date() },
        { id: 6, name: 'Documentary', slug: 'documentary', description: 'Visual Journalism & Archives', display_order: 6, created_at: new Date(), updated_at: new Date() },
        { id: 7, name: 'Commercial', slug: 'commercial', description: 'Brand Campaigns & Lookbooks', display_order: 7, created_at: new Date(), updated_at: new Date() },
        { id: 8, name: 'Art Direction', slug: 'art-direction', description: 'Conceptual Styling & Set Design', display_order: 8, created_at: new Date(), updated_at: new Date() },
        { id: 9, name: 'Visual Storytelling', slug: 'visual-storytelling', description: 'Sequential Photographic Narratives', display_order: 9, created_at: new Date(), updated_at: new Date() },
      ];
      PersistentStore.saveStore();
    }
    return store.categories.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
  }

  async createCategory(data: { name: string; slug?: string; description?: string }): Promise<any> {
    const store = PersistentStore.getStore();
    const existing = store.categories || [];
    const nextId = existing.length > 0 ? Math.max(...existing.map((c: any) => c.id)) + 1 : 1;
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCat = {
      id: nextId,
      name: data.name,
      slug,
      description: data.description || '',
      display_order: nextId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    if (!store.categories) store.categories = [];
    store.categories.push(newCat);
    PersistentStore.saveStore();
    return newCat;
  }

  async updateCategory(id: number, data: { name?: string; slug?: string; description?: string }): Promise<any> {
    const store = PersistentStore.getStore();
    const cat = (store.categories || []).find((c: any) => c.id === id);
    if (!cat) return null;

    if (data.name !== undefined) cat.name = data.name;
    if (data.slug !== undefined) cat.slug = data.slug;
    if (data.description !== undefined) cat.description = data.description;
    cat.updated_at = new Date();

    PersistentStore.saveStore();
    return cat;
  }

  async deleteCategory(id: number): Promise<{ success: boolean; message?: string }> {
    const store = PersistentStore.getStore();
    const cat = (store.categories || []).find((c: any) => c.id === id);
    if (!cat) return { success: false, message: 'Category not found' };

    // Check if any project is currently using this category
    const isUsed = store.projects.some((p) => p.category?.toUpperCase() === cat.name.toUpperCase());
    if (isUsed) {
      // Reassign project categories safely to 'EDITORIAL' or general instead of breaking
      store.projects.forEach((p) => {
        if (p.category?.toUpperCase() === cat.name.toUpperCase()) {
          p.category = 'EDITORIAL';
        }
      });
    }

    store.categories = store.categories.filter((c: any) => c.id !== id);
    PersistentStore.saveStore();
    return { success: true, message: `Category "${cat.name}" removed successfully` };
  }
}

export const projectRepository = new ProjectRepository();
