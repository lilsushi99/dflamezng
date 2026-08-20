import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLayout, AdminTab } from '../../components/admin/AdminLayout';
import { AdminSplashPage } from './AdminSplashPage';
import { AdminHomePage } from './AdminHomePage';
import { AdminProjectsPage } from './AdminProjectsPage';
import { AdminFooterPage } from './AdminFooterPage';
import { Loader2 } from 'lucide-react';

interface AdminDashboardProps {
  initialTab?: AdminTab;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'splash' }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>(initialTab);

  // Sync tab with URL
  useEffect(() => {
    const syncTabFromPath = () => {
      const path = window.location.pathname;
      if (path.includes('/fire/splash')) setCurrentTab('splash');
      else if (path.includes('/fire/home')) setCurrentTab('home');
      else if (path.includes('/fire/projects')) setCurrentTab('projects');
      else if (path.includes('/fire/footer')) setCurrentTab('footer');
      else if (path === '/fire' || path === '/fire/') setCurrentTab('splash');
    };

    syncTabFromPath();
    window.addEventListener('popstate', syncTabFromPath);
    return () => window.removeEventListener('popstate', syncTabFromPath);
  }, []);

  const handleSelectTab = (tab: AdminTab) => {
    setCurrentTab(tab);
    window.history.pushState({}, '', `/fire/${tab}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-xs font-mono">Verifying curator security clearance...</p>
      </div>
    );
  }

  // If not authenticated, redirect to /fire
  if (!isAuthenticated) {
    window.history.replaceState({}, '', '/fire');
    window.dispatchEvent(new PopStateEvent('popstate'));
    return null;
  }

  const getTabHeader = () => {
    switch (currentTab) {
      case 'splash':
        return {
          title: 'Splash Screen & Opening Stack',
          subtitle: 'Configure photographer signature, opening typewriter animation and visual image stack.',
        };
      case 'home':
        return {
          title: 'Home Screen & Image Tracks',
          subtitle: 'Customize navigation bar, foreground/background parallax tracks, bio statement and social links.',
        };
      case 'projects':
        return {
          title: 'Projects & Gallery Archives',
          subtitle: 'Manage all 5 exhibition archives, metadata, curatorial statements and high-resolution photo galleries.',
        };
      case 'footer':
        return {
          title: 'Footer Legal & Credits',
          subtitle: 'Manage bottom copyright notice, design credit agency labels and hyperlinks.',
        };
    }
  };

  const headerInfo = getTabHeader();

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={handleSelectTab}
      title={headerInfo.title}
      subtitle={headerInfo.subtitle}
    >
      {currentTab === 'splash' && <AdminSplashPage />}
      {currentTab === 'home' && <AdminHomePage />}
      {currentTab === 'projects' && <AdminProjectsPage />}
      {currentTab === 'footer' && <AdminFooterPage />}
    </AdminLayout>
  );
};
