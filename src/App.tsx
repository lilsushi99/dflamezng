import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { CollaborationFormPage } from './pages/CollaborationFormPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTab } from './components/admin/AdminLayout';

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

  // Admin routes
  const isAdminLogin = currentPath === '/admin/login' || currentPath === '/admin/login/';
  const isAdminRoute = currentPath.startsWith('/admin') && !isAdminLogin;

  // Determine initial admin tab from path
  const getAdminTabFromPath = (): AdminTab => {
    if (currentPath.includes('/admin/home')) return 'home';
    if (currentPath.includes('/admin/projects')) return 'projects';
    if (currentPath.includes('/admin/footer')) return 'footer';
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

  // If in admin routes, render in admin container with AdminAuthProvider
  if (isAdminLogin) {
    return (
      <AdminAuthProvider>
        <AdminLoginPage
          onLoginSuccess={() => {
            navigateTo('/admin/splash');
          }}
        />
      </AdminAuthProvider>
    );
  }

  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <AdminDashboard initialTab={getAdminTabFromPath()} />
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
