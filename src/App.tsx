import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { CollaborationFormPage } from './pages/CollaborationFormPage';

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
    }
  }, [currentPath]);

  // Determine if on a gallery route: /gallery/:slug
  const galleryMatch = currentPath.match(/^\/gallery\/([a-zA-Z0-9_-]+)/);
  const gallerySlug = galleryMatch ? galleryMatch[1] : null;

  // Determine if on collaborate route: /collaborate or /inquiry or /form
  const isCollaborateRoute =
    currentPath === '/collaborate' ||
    currentPath === '/inquiry' ||
    currentPath === '/form';

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
