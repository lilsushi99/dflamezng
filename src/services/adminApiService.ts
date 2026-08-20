import {
  AdminUser,
  SplashSettings,
  SplashImage,
  HomepageSettings,
  HomepageImage,
  SocialLink,
  Project,
  ProjectImage,
  FooterSettings,
  TrackType,
} from '../types/admin';

const API_BASE = '/api';

// Helper for sending authenticated fetch requests
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('flames_admin_token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

export class AdminApiService {
  // ==========================================
  // AUTH
  // ==========================================
  async login(username: string, password: string): Promise<{ token: string; admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      localStorage.setItem('flames_admin_token', data.token);
    }
    return { token: data.token, admin: data.admin };
  }

  async getMe(): Promise<AdminUser | null> {
    try {
      const res = await fetchWithAuth(`${API_BASE}/auth/me`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.admin || null;
    } catch {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetchWithAuth(`${API_BASE}/auth/logout`, { method: 'POST' });
    } finally {
      localStorage.removeItem('flames_admin_token');
    }
  }

  // ==========================================
  // 1. SPLASH SCREEN
  // ==========================================
  async getSplash(): Promise<{ settings: SplashSettings; images: SplashImage[] }> {
    const res = await fetchWithAuth(`${API_BASE}/admin/splash`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch splash data');
    return { settings: data.settings, images: data.images };
  }

  async updateSplashSettings(settings: Partial<SplashSettings>): Promise<SplashSettings> {
    const res = await fetchWithAuth(`${API_BASE}/admin/splash/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update splash settings');
    return data.settings;
  }

  async uploadSplashImage(file: File): Promise<SplashImage> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetchWithAuth(`${API_BASE}/admin/splash/images/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload splash image');
    return data.image;
  }

  async addSplashImageUrl(url: string): Promise<SplashImage> {
    const res = await fetchWithAuth(`${API_BASE}/admin/splash/images/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add splash image URL');
    return data.image;
  }

  async reorderSplashImages(orderedIds: number[]): Promise<SplashImage[]> {
    const res = await fetchWithAuth(`${API_BASE}/admin/splash/images/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordered_ids: orderedIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reorder splash images');
    return data.images;
  }

  async deleteSplashImage(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/splash/images/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete splash image');
  }

  // ==========================================
  // 2. HOME SCREEN
  // ==========================================
  async getHomeData(): Promise<{
    settings: HomepageSettings;
    frontImages: HomepageImage[];
    backImages: HomepageImage[];
    socialLinks: SocialLink[];
    projects: { id: number; name: string; year: string; category: string }[];
  }> {
    const res = await fetchWithAuth(`${API_BASE}/admin/home`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch home screen data');
    return {
      settings: data.settings,
      frontImages: data.frontImages,
      backImages: data.backImages,
      socialLinks: data.socialLinks,
      projects: data.projects,
    };
  }

  async updateHomeSettings(settings: Partial<HomepageSettings>): Promise<HomepageSettings> {
    const res = await fetchWithAuth(`${API_BASE}/admin/home/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update home settings');
    return data.settings;
  }

  async uploadHomepageImage(file: File, track: TrackType, projectId?: number | null): Promise<HomepageImage> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('track', track);
    if (projectId) formData.append('project_id', String(projectId));

    const res = await fetchWithAuth(`${API_BASE}/admin/homepage/images/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload homepage image');
    return data.image;
  }

  async addHomepageImageUrl(url: string, track: TrackType, projectId?: number | null): Promise<HomepageImage> {
    const res = await fetchWithAuth(`${API_BASE}/admin/homepage/images/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, track, project_id: projectId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add homepage image URL');
    return data.image;
  }

  async updateHomepageImage(id: number, payload: { project_id?: number | null; track?: TrackType; display_order?: number }): Promise<HomepageImage> {
    const res = await fetchWithAuth(`${API_BASE}/admin/homepage/images/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update homepage image');
    return data.image;
  }

  async reorderHomepageImages(track: TrackType, orderedIds: number[]): Promise<HomepageImage[]> {
    const res = await fetchWithAuth(`${API_BASE}/admin/homepage/images/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ track, ordered_ids: orderedIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reorder homepage images');
    return data.images;
  }

  async deleteHomepageImage(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/homepage/images/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete homepage image');
  }

  // Social Links
  async addSocialLink(link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>): Promise<SocialLink> {
    const res = await fetchWithAuth(`${API_BASE}/admin/social-links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add social link');
    return data.link;
  }

  async updateSocialLink(id: number, link: Partial<SocialLink>): Promise<SocialLink> {
    const res = await fetchWithAuth(`${API_BASE}/admin/social-links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update social link');
    return data.link;
  }

  async reorderSocialLinks(orderedIds: number[]): Promise<SocialLink[]> {
    const res = await fetchWithAuth(`${API_BASE}/admin/social-links/reorder/batch`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordered_ids: orderedIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reorder social links');
    return data.links;
  }

  async deleteSocialLink(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/social-links/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete social link');
  }

  // ==========================================
  // 3. PROJECTS
  // ==========================================
  async getProjects(): Promise<Project[]> {
    const res = await fetchWithAuth(`${API_BASE}/admin/projects`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
    return data.projects;
  }

  async getProject(id: number): Promise<Project> {
    const res = await fetchWithAuth(`${API_BASE}/admin/projects/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch project');
    return data.project;
  }

  async updateProject(id: number, payload: Partial<Project>): Promise<Project> {
    const res = await fetchWithAuth(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update project');
    return data.project;
  }

  async uploadProjectImage(projectId: number, file: File): Promise<ProjectImage> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetchWithAuth(`${API_BASE}/admin/projects/${projectId}/images/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload project image');
    return data.image;
  }

  async addProjectImageUrl(projectId: number, url: string): Promise<ProjectImage> {
    const res = await fetchWithAuth(`${API_BASE}/admin/projects/${projectId}/images/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add project image URL');
    return data.image;
  }

  async reorderProjectImages(projectId: number, orderedIds: number[]): Promise<ProjectImage[]> {
    const res = await fetchWithAuth(`${API_BASE}/admin/projects/${projectId}/images/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ordered_ids: orderedIds }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reorder project images');
    return data.images;
  }

  async deleteProjectImage(imageId: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/admin/projects/images/${imageId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete project image');
  }

  // ==========================================
  // 4. FOOTER
  // ==========================================
  async getFooter(): Promise<FooterSettings> {
    const res = await fetchWithAuth(`${API_BASE}/admin/footer`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch footer settings');
    return data.footer;
  }

  async updateFooter(payload: Partial<FooterSettings>): Promise<FooterSettings> {
    const res = await fetchWithAuth(`${API_BASE}/admin/footer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update footer settings');
    return data.footer;
  }
}

export const adminApiService = new AdminApiService();
