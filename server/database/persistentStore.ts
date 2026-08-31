import fs from 'fs';
import path from 'path';
import {
  defaultAdmins,
  defaultSiteSettings,
  defaultSplashSettings,
  defaultSplashImages,
  defaultHomepageSettings,
  defaultHomepageImages,
  defaultProjects,
  defaultProjectImages,
  defaultSocialLinks,
  defaultFooterSettings,
} from './seedData';
import { Admin } from '../models/Admin';
import { SiteSettings, SocialLink, FooterSettings } from '../models/Settings';
import { SplashSettings, SplashImage } from '../models/Splash';
import { HomepageSettings, HomepageImage } from '../models/Homepage';
import { Project, ProjectImage } from '../models/Project';

export interface DatabaseManifest {
  admins: Admin[];
  siteSettings: SiteSettings;
  splashSettings: SplashSettings;
  splashImages: SplashImage[];
  homepageSettings: HomepageSettings;
  homepageImages: HomepageImage[];
  projects: Project[];
  projectImages: ProjectImage[];
  socialLinks: SocialLink[];
  footerSettings: FooterSettings;
}

const storageDir = path.join(process.cwd(), 'storage');
const manifestFilePath = path.join(storageDir, 'db_manifest.json');

// In-memory cache synced with disk
let cachedStore: DatabaseManifest | null = null;

function getInitialStore(): DatabaseManifest {
  return {
    admins: JSON.parse(JSON.stringify(defaultAdmins)),
    siteSettings: JSON.parse(JSON.stringify(defaultSiteSettings)),
    splashSettings: JSON.parse(JSON.stringify(defaultSplashSettings)),
    splashImages: JSON.parse(JSON.stringify(defaultSplashImages)),
    homepageSettings: JSON.parse(JSON.stringify(defaultHomepageSettings)),
    homepageImages: JSON.parse(JSON.stringify(defaultHomepageImages)),
    projects: JSON.parse(JSON.stringify(defaultProjects)),
    projectImages: JSON.parse(JSON.stringify(defaultProjectImages)),
    socialLinks: JSON.parse(JSON.stringify(defaultSocialLinks)),
    footerSettings: JSON.parse(JSON.stringify(defaultFooterSettings)),
  };
}

export class PersistentStore {
  public static getStore(): DatabaseManifest {
    if (cachedStore) {
      return cachedStore;
    }

    try {
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }

      if (fs.existsSync(manifestFilePath)) {
        const fileContent = fs.readFileSync(manifestFilePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        cachedStore = {
          admins: parsed.admins || defaultAdmins,
          siteSettings: parsed.siteSettings || defaultSiteSettings,
          splashSettings: parsed.splashSettings || defaultSplashSettings,
          splashImages: parsed.splashImages || defaultSplashImages,
          homepageSettings: parsed.homepageSettings || defaultHomepageSettings,
          homepageImages: parsed.homepageImages || defaultHomepageImages,
          projects: parsed.projects || defaultProjects,
          projectImages: parsed.projectImages || defaultProjectImages,
          socialLinks: parsed.socialLinks || defaultSocialLinks,
          footerSettings: parsed.footerSettings || defaultFooterSettings,
        };
      } else {
        cachedStore = getInitialStore();
        this.saveStore(cachedStore);
      }
    } catch (err) {
      console.warn('[PersistentStore] Error loading manifest, initializing defaults:', err);
      cachedStore = getInitialStore();
    }

    return cachedStore!;
  }

  public static saveStore(store?: DatabaseManifest): void {
    if (store) {
      cachedStore = store;
    }
    if (!cachedStore) return;

    try {
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true });
      }
      fs.writeFileSync(manifestFilePath, JSON.stringify(cachedStore, null, 2), 'utf-8');
    } catch (err) {
      console.error('[PersistentStore] Failed to write db_manifest.json to storage directory:', err);
    }
  }
}
