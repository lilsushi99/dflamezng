import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { CollaborationFormPage } from './pages/CollaborationFormPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTab } from './components/admin/AdminLayout';
import { Loader2 } from 'lucide-react';

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
      document.title = 'Gold Akingbade — Fashion & Editorial Photography';
    }
  };

  useEffect(() => {
    if (currentPath === '/') {
      document.title = 'Gold Akingbade — Fashion & Editorial Photography';
    } else if (currentPath.startsWith('/admin')) {
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
    return 'splash';
  };

  // Determine if on a gallery route: /gallery/:slug
  const galleryMatch = currentPath.match(/^\/gallery\/([a-zA-Z0-9_-]+)/);
  const gallerySlug = galleryMatch ? galleryMatch[1] : null;

  // Determine if on collaborate route: /collaborate or /inquiry or /form
  const isCollaborateRoute =
    currentPath === '/collaborate' ||
    currentPath === '/inquiry' ||
    currentPath === '/form';

  // Legacy /admin redirect to /fire
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      const redirected = currentPath.replace('/admin', '/fire');
      window.history.replaceState({}, '', redirected || '/fire');
      setCurrentPath(redirected || '/fire');
    }
  }, [currentPath]);

  // If in admin routes (/fire), render in admin container with AdminAuthProvider
  if (isFireRoute) {
    return (
      <AdminAuthProvider>
        <AdminPortalRouter
          path={currentPath}
          isFireLogin={isFireLogin || isFireBase}
          initialTab={getAdminTabFromPath()}
          onNavigate={(path) => navigateTo(path)}
        />
      </AdminAuthProvider>
    );
  }

  // PUBLIC WEBSITE (Unmodified, exactly as originally designed)
  return (
    <ThemeProvider>
      <div className="w-full min-h-screen bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400">
        {gallerySlug ? (
          <GalleryPage
            projectSlug={gallerySlug}
            onNavigateHome={() => navigateTo('/')}
            onNavigateProject={(slug) => navigateTo(`/gallery/${slug}`)}
          />
        ) : isCollaborateRoute ? (
          <CollaborationFormPage onNavigateHome={() => navigateTo('/')} />
        ) : (
          <HomePage
            onNavigateGallery={(slug) => navigateTo(`/gallery/${slug}`)}
            onNavigateCollaborate={() => navigateTo('/collaborate')}
            introCompleted={introCompleted}
            onMarkIntroComplete={() => setIntroCompleted(true)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}
