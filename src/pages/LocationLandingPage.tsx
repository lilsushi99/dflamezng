import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, CheckCircle2, Mail, Camera, Compass } from 'lucide-react';
import { publicApiService } from '../services/publicApiService';
import { HeaderNav } from '../components/navigation/HeaderNav';
import { Footer } from '../components/portfolio/Footer';
import { applySeoTags } from '../utils/seoHelper';
import { NotFoundPage } from './NotFoundPage';

interface LocationLandingPageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateProject: (slug: string) => void;
  onNavigateCollaborate?: () => void;
}

export const LocationLandingPage: React.FC<LocationLandingPageProps> = ({
  slug,
  onNavigateHome,
  onNavigateProject,
  onNavigateCollaborate,
}) => {
  const [locationData, setLocationData] = useState<any | null>(null);
  const [siteSettings, setSiteSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setIsNotFound(false);

    Promise.all([
      publicApiService.fetchLocationBySlug(slug),
      publicApiService.fetchGlobalSeo(),
    ])
      .then(([locResult, seoResult]) => {
        if (!isMounted) return;
        if (locResult && locResult.location) {
          const loc = locResult.location;
          setLocationData(loc);
          if (locResult.siteSettings) {
            setSiteSettings(locResult.siteSettings);
          }

          const creatorName =
            locResult.siteSettings?.photographer_name ||
            publicApiService.getState().photographerName ||
            'Creative Monograph';

          const profType = loc.professional_type || 'Fashion & Editorial Photographer';

          // Apply full dynamic SEO to browser head
          applySeoTags({
            title: loc.seo_title || `${loc.location_name} ${profType} | ${creatorName}`,
            description: loc.meta_description,
            keywords: `${loc.primary_keyword || ''}${loc.secondary_keywords ? ', ' + loc.secondary_keywords : ''}`,
            canonicalUrl: `${window.location.origin}/location/${loc.url_slug.replace(/^\/+/, '')}`,
            ogTitle: loc.og_title || loc.seo_title,
            ogDescription: loc.og_description || loc.meta_description,
            ogImage: loc.og_image_url || null,
            robots: loc.is_indexable ? 'index, follow' : 'noindex, nofollow',
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: `${creatorName} — ${profType} in ${loc.location_name}`,
              url: `${window.location.origin}/location/${loc.url_slug.replace(/^\/+/, '')}`,
              description: loc.meta_description,
              address: {
                '@type': 'PostalAddress',
                addressLocality: loc.location_name,
                addressRegion: loc.state,
                addressCountry: 'NG',
              },
              areaServed: [loc.location_name, loc.state, 'Nigeria'],
            },
          });
        } else {
          setIsNotFound(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsNotFound(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFDF3] dark:bg-[#111111] flex flex-col items-center justify-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-amber-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono tracking-widest uppercase">Loading Regional Monograph...</p>
      </div>
    );
  }

  if (isNotFound || !locationData) {
    return (
      <NotFoundPage
        onNavigateHome={onNavigateHome}
        onNavigateCollaborate={onNavigateCollaborate}
      />
    );
  }

  const projects = publicApiService.getState().projects || [];
  const creatorName =
    siteSettings?.photographer_name ||
    publicApiService.getState().photographerName ||
    'Creative Artist';
  const contactEmail =
    siteSettings?.contact_email ||
    publicApiService.getState().contactEmail ||
    'inquiries@portfolio.studio';
  const professionalType =
    locationData.professional_type || 'Fashion & Editorial Photographer';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400">
      <header className="px-6 md:px-12 pt-8 pb-4">
        <HeaderNav onLogoClick={onNavigateHome} />
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex-1 w-full space-y-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Projects & Portfolios</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {locationData.location_name}
              {locationData.state ? `, ${locationData.state}` : ''}
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase px-3 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
              {professionalType}
            </span>
            {locationData.primary_keyword && (
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 rounded-full">
                {locationData.primary_keyword}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1]">
            {locationData.seo_title || `${locationData.location_name} Creative Studio`}
          </h1>

          {locationData.meta_description && (
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-3xl">
              {locationData.meta_description}
            </p>
          )}
        </section>

        {/* Curatorial Statement & Regional Story */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">
              Regional Vision & Creative Practice
            </h2>
            <div className="text-sm sm:text-base leading-relaxed space-y-4 text-neutral-800 dark:text-neutral-300 font-sans">
              {locationData.location_content ? (
                <p className="whitespace-pre-line">{locationData.location_content}</p>
              ) : (
                <p>
                  {creatorName} executes curated visual narratives, editorial commissions, and brand architecture across {locationData.location_name} and the wider {locationData.state || 'Nigeria'} territory. Merging distinct creative discipline, lighting precision, and cultural depth, each project honors the unique energy and aesthetic of the region.
                </p>
              )}
            </div>
          </div>

          {/* Services & Deliverables */}
          <div className="space-y-4 p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">
              Services in {locationData.location_name}
            </h2>
            <ul className="space-y-2.5 text-xs font-mono">
              {(locationData.services_offered && locationData.services_offered.length > 0
                ? locationData.services_offered
                : [
                    'Creative Direction & Visual Storytelling',
                    'Editorial Campaigns & Brand Lookbooks',
                    'Cultural Features & Documentary Monograph',
                    'Fine Art Portfolios & Exhibitions',
                    'Commercial Productions & Studio Commissions',
                  ]
              ).map((service: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Inquiry: ${locationData.location_name} Creative Commission`)}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-xl text-xs font-mono uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Direct Studio Booking</span>
              </a>

              {onNavigateCollaborate && (
                <button
                  type="button"
                  onClick={onNavigateCollaborate}
                  className="w-full text-center py-2 text-[11px] font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                >
                  Or Submit Commission Form →
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        {projects.length > 0 && (
          <section className="space-y-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">Featured Archive Portfolios</h2>
                <p className="text-sm font-serif mt-1">Curated monographs produced across Nigeria</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => {
                const coverImage = project.images?.[0]?.src || project.images?.[0]?.fallbackSrc;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onNavigateProject(project.slug || project.id)}
                    className="group text-left space-y-3 cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Camera className="w-8 h-8 stroke-1" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-sm font-serif group-hover:text-amber-500 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] font-mono opacity-50">{project.year}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
