import React, { useState } from 'react';
import {
  Sparkles,
  LayoutGrid,
  FolderKanban,
  FileText,
  Mail,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Camera,
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export type AdminTab = 'splash' | 'home' | 'projects' | 'footer';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
  title,
  subtitle,
  headerAction,
}) => {
  const { user, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePublicSiteNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const navItems = [
    {
      id: 'splash' as AdminTab,
      label: 'SPLASH SCREEN',
      icon: Sparkles,
      description: 'Name, Typewriter & Opening Stack',
      disabled: false,
    },
    {
      id: 'home' as AdminTab,
      label: 'HOME SCREEN',
      icon: LayoutGrid,
      description: 'Navbar, Image Tracks & Bio',
      disabled: false,
    },
    {
      id: 'projects' as AdminTab,
      label: 'PROJECTS',
      icon: FolderKanban,
      description: '5 Projects & Gallery Archives',
      disabled: false,
    },
    {
      id: 'footer' as AdminTab,
      label: 'FOOTER',
      icon: FileText,
      description: 'Copyright & Studio Credits',
      disabled: false,
    },
    {
      id: 'contact' as any,
      label: 'CONTACT',
      icon: Mail,
      description: 'Client Inquiry System',
      disabled: true,
      badge: 'COMING SOON',
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-semibold tracking-wider uppercase text-neutral-100 font-mono">
              FLAMES CMS
            </h1>
            <p className="text-[10px] text-neutral-400 font-mono">Curator Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/80 backdrop-blur-sm pt-16 flex flex-col">
          <div className="flex-1 bg-neutral-900 border-b border-neutral-800 p-4 space-y-2 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest text-neutral-400">
              Site Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              if (item.disabled) return null;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-950 font-medium shadow-sm'
                      : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <div className="flex-1">
                    <div className="text-xs font-semibold tracking-wider font-mono uppercase">{item.label}</div>
                    <div className={`text-[10px] ${isActive ? 'text-neutral-700' : 'text-neutral-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-neutral-800 space-y-2">
              <button
                type="button"
                onClick={handlePublicSiteNavigation}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-800 text-neutral-200 rounded-xl text-xs font-mono tracking-wide"
              >
                <span>VIEW PUBLIC SITE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-red-950/40 text-red-400 border border-red-900/60 rounded-xl text-xs font-mono tracking-wide"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOG OUT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-neutral-900 border-r border-neutral-800/80 flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider uppercase text-neutral-100 font-mono">
              FLAMES CMS
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">Curator Control Panel</p>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest text-neutral-300">
            Site Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-neutral-600 bg-neutral-950/40 border border-neutral-900 cursor-not-allowed select-none opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-neutral-600" />
                    <div>
                      <div className="text-xs font-medium tracking-wide">{item.label}</div>
                      <div className="text-[10px] text-neutral-600">{item.description}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono tracking-tight uppercase bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-700/60">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-950 font-medium shadow-sm'
                    : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                <div className="flex-1">
                  <div className="text-xs font-semibold tracking-wider font-mono uppercase">{item.label}</div>
                  <div className={`text-[10px] ${isActive ? 'text-neutral-700' : 'text-neutral-300'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info & session */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/60 space-y-3">
          {/* Active Admin Identity */}
          <div className="flex items-center justify-between bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-medium text-neutral-200">
                  {user?.display_name || user?.username || 'Authenticated Admin'}
                </div>
                <div className="text-[10px] text-neutral-300 font-mono">Lead Curator</div>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Log out"
              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick link to live public site */}
          <button
            type="button"
            onClick={handlePublicSiteNavigation}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-mono tracking-wide transition-all border border-neutral-700/60"
          >
            <span>VIEW PUBLIC SITE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-100 font-serif">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
          </div>

          {headerAction && <div className="flex items-center gap-3">{headerAction}</div>}
        </header>

        {/* Workspace Body */}
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto flex-1">{children}</div>
      </main>
    </div>
  );
};

