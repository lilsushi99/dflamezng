import { Project, ProjectImage } from '../models/Project';
import { isDatabaseConnected, query, execute } from '../database/db';
import { defaultProjects, defaultProjectImages } from '../database/seedData';

let localProjects: Project[] = JSON.parse(JSON.stringify(defaultProjects));
let localProjectImages: ProjectImage[] = JSON.parse(JSON.stringify(defaultProjectImages));

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

        return projects.map((p) => ({
          ...p,
          images: images.filter((img) => img.project_id === p.id),
        }));
      } catch (e) {
        console.warn('[ProjectRepository] Falling back to local store for findAll:', e);
      }
    }

    return localProjects.map((p) => ({
      ...p,
      images: [...localProjectImages.filter((img) => img.project_id === p.id)].sort((a, b) => a.display_order - b.display_order),
    }));
  }

  async findById(id: number): Promise<Project | null> {
    if (isDatabaseConnected()) {
      try {
        const projects = await query<Project>(
          'SELECT id, name, subtext, year, category, story, created_at, updated_at FROM projects WHERE id = ? LIMIT 1',
          [id]
        );
        if (!projects[0]) return null;

        const images = await query<ProjectImage>(
          'SELECT id, project_id, file_path, external_url, source_type, display_order, created_at, updated_at FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
          [id]
        );

        return {
          ...projects[0],
          images,
        };
      } catch (e) {
        console.warn('[ProjectRepository] Falling back to local store for findById:', e);
      }
    }

    const project = localProjects.find((p) => p.id === id);
    if (!project) return null;

    return {
      ...project,
      images: [...localProjectImages.filter((img) => img.project_id === id)].sort((a, b) => a.display_order - b.display_order),
    };
  }

  async updateProject(id: number, data: Partial<Project>): Promise<Project | null> {
    if (isDatabaseConnected()) {
      try {
        const current = localProjects.find((p) => p.id === id);
        if (current) {
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
        }
      } catch (e) {
        console.warn('[ProjectRepository] DB update failed for project:', e);
      }
    }

    const project = localProjects.find((p) => p.id === id);
    if (project) {
      if (data.name !== undefined) project.name = data.name;
      if (data.subtext !== undefined) project.subtext = data.subtext;
      if (data.year !== undefined) project.year = data.year;
      if (data.category !== undefined) project.category = data.category;
      if (data.story !== undefined) project.story = data.story;
      project.updated_at = new Date();
      return this.findById(id);
    }
    return null;
  }

  async findImagesByProjectId(projectId: number): Promise<ProjectImage[]> {
    if (isDatabaseConnected()) {
      try {
        return await query<ProjectImage>(
          'SELECT id, project_id, file_path, external_url, source_type, display_order, created_at, updated_at FROM project_images WHERE project_id = ? ORDER BY display_order ASC, id ASC',
          [projectId]
        );
      } catch (e) {
        console.warn('[ProjectRepository] Falling back to local store for findImagesByProjectId:', e);
      }
    }

    return [...localProjectImages.filter((img) => img.project_id === projectId)].sort((a, b) => a.display_order - b.display_order);
  }

  async addProjectImage(image: Omit<ProjectImage, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectImage> {
    const existing = localProjectImages.filter((i) => i.project_id === image.project_id);
    const nextOrder = image.display_order || (existing.length > 0 ? Math.max(...existing.map((i) => i.display_order)) + 1 : 1);

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO project_images (project_id, file_path, external_url, source_type, display_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [image.project_id, image.file_path, image.external_url, image.source_type, nextOrder]
        );
        const newId = res.insertId;
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
        localProjectImages.push(createdImage);
        return createdImage;
      } catch (e) {
        console.warn('[ProjectRepository] DB insert failed for project image:', e);
      }
    }

    const nextId = localProjectImages.length > 0 ? Math.max(...localProjectImages.map((i) => i.id)) + 1 : 1;
    const newImage: ProjectImage = {
      id: nextId,
      project_id: image.project_id,
      file_path: image.file_path,
      external_url: image.external_url,
      source_type: image.source_type,
      display_order: nextOrder,
      created_at: new Date(),
      updated_at: new Date(),
    };
    localProjectImages.push(newImage);
    return newImage;
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

    orderedIds.forEach((id, index) => {
      const item = localProjectImages.find((img) => img.id === id && img.project_id === projectId);
      if (item) {
        item.display_order = index + 1;
        item.updated_at = new Date();
      }
    });

    return [...localProjectImages.filter((img) => img.project_id === projectId)].sort((a, b) => a.display_order - b.display_order);
  }

  async deleteProjectImage(imageId: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM project_images WHERE id = ?', [imageId]);
      } catch (e) {
        console.warn('[ProjectRepository] DB delete failed for project image:', e);
      }
    }

    const initialLength = localProjectImages.length;
    localProjectImages = localProjectImages.filter((img) => img.id !== imageId);
    return localProjectImages.length < initialLength;
  }
}

export const projectRepository = new ProjectRepository();
