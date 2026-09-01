import { Request, Response } from 'express';
import { projectRepository } from '../repositories/projectRepository';

export class AdminProjectController {
  // GET /api/admin/projects
  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectRepository.findAll();
      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve projects',
        error: error?.message,
      });
    }
  }

  // GET /api/admin/projects/:id
  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const project = await projectRepository.findById(id);

      if (!project) {
        res.status(404).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        project,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve project details',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/projects/:id
  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { name, subtext, year, category, story } = req.body;

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({
          success: false,
          message: 'Project name is required',
        });
        return;
      }

      const updated = await projectRepository.updateProject(id, {
        name: name.trim(),
        subtext: subtext !== undefined ? subtext : undefined,
        year: year ? String(year).trim() : '2025',
        category: category ? String(category).trim().toUpperCase() : 'EDITORIAL',
        story: story !== undefined ? story : undefined,
      });

      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Project details updated successfully',
        project: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/projects/:id/images/upload (device upload)
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const projectId = Number(req.params.id);
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No image file was uploaded',
        });
        return;
      }

      const filePath = `/storage/projects/${req.file.filename}`;
      const newImage = await projectRepository.addProjectImage({
        project_id: projectId,
        file_path: filePath,
        external_url: null,
        source_type: 'local',
        display_order: req.body.display_order ? Number(req.body.display_order) : 0,
      });

      res.status(201).json({
        success: true,
        message: 'Project gallery image uploaded successfully',
        image: newImage,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to upload project image',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/projects/:id/images/url (URL upload)
  async addImageUrl(req: Request, res: Response): Promise<void> {
    try {
      const projectId = Number(req.params.id);
      const { url, display_order } = req.body;

      if (!url || typeof url !== 'string' || !url.trim().startsWith('http')) {
        res.status(400).json({
          success: false,
          message: 'A valid HTTP or HTTPS image URL is required',
        });
        return;
      }

      const newImage = await projectRepository.addProjectImage({
        project_id: projectId,
        file_path: null,
        external_url: url.trim(),
        source_type: 'external',
        display_order: display_order ? Number(display_order) : 0,
      });

      res.status(201).json({
        success: true,
        message: 'Project gallery image URL added successfully',
        image: newImage,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to add project image URL',
        error: error?.message,
      });
    }
  }

  // PUT /api/admin/projects/:id/images/reorder
  async reorderImages(req: Request, res: Response): Promise<void> {
    try {
      const projectId = Number(req.params.id);
      const { ordered_ids } = req.body;

      if (!Array.isArray(ordered_ids)) {
        res.status(400).json({
          success: false,
          message: 'ordered_ids must be an array of image IDs',
        });
        return;
      }

      const images = await projectRepository.reorderProjectImages(projectId, ordered_ids.map(Number));

      res.status(200).json({
        success: true,
        message: 'Project gallery images reordered successfully',
        images,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to reorder project images',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/projects/images/:imageId
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const imageId = Number(req.params.imageId);
      const deleted = await projectRepository.deleteProjectImage(imageId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Project image not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Project image deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete project image',
        error: error?.message,
      });
    }
  }

  // POST /api/admin/projects
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const { name, subtext, year, category, story } = req.body;
      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({
          success: false,
          message: 'Project name is required',
        });
        return;
      }

      const newProject = await projectRepository.createProject({
        name: name.trim(),
        subtext: subtext ? String(subtext).trim() : '',
        year: year ? String(year).trim() : String(new Date().getFullYear()),
        category: category ? String(category).trim().toUpperCase() : 'PORTRAIT',
        story: story ? String(story).trim() : '',
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project: newProject,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: error?.message,
      });
    }
  }

  // DELETE /api/admin/projects/:id
  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await projectRepository.deleteProject(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        error: error?.message,
      });
    }
  }

  // ==========================================
  // CATEGORIES
  // ==========================================
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await projectRepository.findAllCategories();
      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: error?.message,
      });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, slug, description } = req.body;
      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({
          success: false,
          message: 'Category name is required',
        });
        return;
      }

      const cat = await projectRepository.createCategory({
        name: name.trim(),
        slug: slug ? String(slug).trim() : undefined,
        description: description ? String(description).trim() : undefined,
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        category: cat,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error?.message,
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { name, slug, description } = req.body;
      const updated = await projectRepository.updateCategory(id, { name, slug, description });

      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Category not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        category: updated,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error?.message,
      });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await projectRepository.deleteCategory(id);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error?.message,
      });
    }
  }
}

export const adminProjectController = new AdminProjectController();
