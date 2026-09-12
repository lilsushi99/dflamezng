import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { CollaborationFormPage } from './pages/CollaborationFormPage';
import { LocationLandingPage } from './pages/LocationLandingPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTab } from './components/admin/AdminLayout';
import { Loader2 } from 'lucide-react';
import { publicApiService } from './services/publicApiService';

interface AdminPortalRouterProps {
  path: string;
  isFireLogin: boolean;
  initialTab: AdminTab;
  onNavigate: (path: string) => void;
}

function AdminPortalRouter({ isFireLogin, initialTab, onNavigate }: AdminPortalRouterProps) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-xs font-mono">Authenticating secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          onNavigate('/fire/splash');
        }}
      />
    );
  }

  // If authenticated and user navigates to /fire or /fire/login, route to /fire/splash
  const activeTab = isFireLogin ? 'splash' : initialTab;
  return <AdminDashboard initialTab={activeTab} />;
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [introCompleted, setIntroCompleted] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path === '/') {
      setIntroCompleted(true);
    }
  };

  useEffect(() => {
    if (currentPath === '/') {
      publicApiService.fetchGlobalSeo().then((seo) => {
        if (seo?.site_title) {
          document.title = seo.site_title;
        } else {
          const name = publicApiService.getState().photographerName || 'Creative Portfolio';
          document.title = `${name} — Creative Portfolio & Monograph`;
        }
      });
    } else if (currentPath.startsWith('/admin') || currentPath.startsWith('/fire')) {
      document.title = 'Flames CMS — Admin Portal';
    }
  }, [currentPath]);

  // Admin routes: ONLY /fire prefix
  const isFireBase = currentPath === '/fire' || currentPath === '/fire/';
  const isFireLogin = currentPath === '/fire/login' || currentPath === '/fire/login/';
  const isFireRoute = currentPath.startsWith('/fire');

  // Determine initial admin tab from path
  const getAdminTabFromPath = (): AdminTab => {
    if (currentPath.includes('/fire/home')) return 'home';
    if (currentPath.includes('/fire/projects')) return 'projects';
    if (currentPath.includes('/fire/footer')) return 'footer';
    if (currentPath.includes('/fire/seo')) return 'seo';
    if (currentPath.includes('/fire/contact')) return 'contact';
    return 'splash';
  };

  // Determine if on a gallery route: /gallery/:slug
  const galleryMatch = currentPath.match(/^\/gallery\/([a-zA-Z0-9_-]+)/);
  const gallerySlug = galleryMatch ? galleryMatch[1] : null;

  // Determine if on location landing route: /location/:slug
  const locationMatch = currentPath.match(/^\/location\/([a-zA-Z0-9_-]+)/);
  const locationSlug = locationMatch ? locationMatch[1] : null;

  // Determine if on collaborate route: /collaborate or /inquiry or /form
  const isCollaborateRoute =
    currentPath === '/collaborate' ||
    currentPath === '/inquiry' ||
    currentPath === '/form';

  const isHomeRoute = currentPath === '/' || currentPath === '';

  const LEGAL_CONTENT: Record<string, { title: string; content: string }> = {
    '/terms': {
      title: 'Terms & Conditions',
      content: `By submitting a booking request through this site, you agree to work with Gold Akingbade Studio in good faith to define project scope, deliverables, timeline, and payment terms before any shoot is scheduled.

A booking request is not a confirmed engagement. Confirmation happens once both parties agree on the project brief, budget, and schedule in writing (email or WhatsApp).

Deposits, cancellation terms, usage rights, and delivery timelines will be communicated directly and agreed upon per project before work begins.

The studio reserves the right to decline any booking request that does not align with its creative direction or availability.`,
    },
    '/privacy': {
      title: 'Privacy Policy',
      content: `We collect the information you submit through the booking form (name, email, phone/WhatsApp, project location, budget, and project brief) solely to respond to your request and manage the resulting engagement.

Your information is never sold or shared with third parties for marketing purposes. It is used only to communicate with you about your booking and, where applicable, to fulfil the resulting project.

You may request that your information be deleted from our records at any time by contacting the studio directly.`,
    },
    '/cookies': {
      title: 'Cookies Policy',
      content: `This site uses minimal, essential cookies required for basic functionality, such as remembering your light/dark theme preference.

We do not use tracking or advertising cookies. No personal data is collected via cookies on this site.`,
    },
  };
  const legalPageEntry = LEGAL_CONTENT[currentPath];

  // Legacy /admin redirect to /fire
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      const redirected = currentPath.replace('/admin', '/fire');
      window.history.replaceState({}, '', redirected || '/fire');
      setCurrentPath(redirected || '/fire');
    }
  }, [currentPath]);

  // If in admin routes (/fire), render in admin container with ThemeProvider & AdminAuthProvider
  if (isFireRoute) {
    return (
      <ThemeProvider>
        <AdminAuthProvider>
          <AdminPortalRouter
            path={currentPath}
            isFireLogin={isFireLogin || isFireBase}
            initialTab={getAdminTabFromPath()}
            onNavigate={(path) => navigateTo(path)}
          />
        </AdminAuthProvider>
      </ThemeProvider>
    );
  }

  // PUBLIC WEBSITE
  return (
    <ThemeProvider>
      <div className="w-full min-h-screen bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400">
        {gallerySlug ? (
          <GalleryPage
            projectSlug={gallerySlug}
            onNavigateHome={() => navigateTo('/')}
            onNavigateProject={(slug) => navigateTo(`/gallery/${slug}`)}
          />
        ) : locationSlug ? (
          <LocationLandingPage
            slug={locationSlug}
            onNavigateHome={() => navigateTo('/')}
            onNavigateProject={(slug) => navigateTo(`/gallery/${slug}`)}
            onNavigateCollaborate={() => navigateTo('/collaborate')}
          />
        ) : isCollaborateRoute ? (
          <CollaborationFormPage
            onNavigateHome={() => navigateTo('/')}
            onNavigateTerms={() => navigateTo('/terms')}
          />
        ) : legalPageEntry ? (
          <LegalPage
            title={legalPageEntry.title}
            content={legalPageEntry.content}
            onNavigateHome={() => navigateTo('/')}
          />
        ) : isHomeRoute ? (
          <HomePage
            onNavigateGallery={(slug) => navigateTo(`/gallery/${slug}`)}
            onNavigateCollaborate={() => navigateTo('/collaborate')}
            introCompleted={introCompleted}
            onMarkIntroComplete={() => setIntroCompleted(true)}
          />
        ) : (
          <NotFoundPage
            onNavigateHome={() => navigateTo('/')}
            onNavigateCollaborate={() => navigateTo('/collaborate')}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
