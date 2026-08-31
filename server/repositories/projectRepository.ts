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
}

export const projectRepository = new ProjectRepository();
