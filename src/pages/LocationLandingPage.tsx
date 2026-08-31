import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Sparkles, Camera, CheckCircle2, Mail, ExternalLink, Calendar } from 'lucide-react';
import { publicApiService } from '../services/publicApiService';
import { HeaderNav } from '../components/navigation/HeaderNav';
import { Footer } from '../components/portfolio/Footer';

interface LocationLandingPageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateProject: (slug: string) => void;
}

export const LocationLandingPage: React.FC<LocationLandingPageProps> = ({
  slug,
  onNavigateHome,
  onNavigateProject,
}) => {
  const [locationData, setLocationData] = useState<any | null>(null);
  const [globalSeo, setGlobalSeo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      publicApiService.fetchLocationBySlug(slug),
      publicApiService.fetchGlobalSeo(),
    ])
      .then(([locResult, seoResult]) => {
        if (!isMounted) return;
        if (locResult && locResult.location) {
          setLocationData(locResult.location);
          if (seoResult) setGlobalSeo(seoResult);

          // Update Document Title and Meta tags dynamically
          document.title = `${locResult.location.seo_title || locResult.location.location_name} | Gold Akingbade`;
        } else {
          setError('Location page not found');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Failed to load location page');
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
        <p className="text-xs font-mono tracking-widest uppercase">Loading Photography Archive...</p>
      </div>
    );
  }

  if (error || !locationData) {
    return (
      <div className="min-h-screen bg-[#FEFDF3] dark:bg-[#111111] flex flex-col items-center justify-center p-6 text-center">
        <MapPin className="w-12 h-12 text-neutral-400 mb-4 stroke-1" />
        <h1 className="text-2xl font-serif mb-2 text-neutral-900 dark:text-neutral-100">Location Archive Not Found</h1>
        <p className="text-xs font-mono text-neutral-500 max-w-md mb-8">
          The requested regional portfolio archive is currently unavailable or has been re-indexed.
        </p>
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-full text-xs font-mono uppercase tracking-widest transition-transform hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    );
  }

  const projects = publicApiService.getState().projects || [];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3]">
      <header className="px-6 md:px-12 pt-8 pb-4">
        <HeaderNav onLogoClick={onNavigateHome} />
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex-1 w-full space-y-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Projects & Portfolios</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationData.location_name}, {locationData.state}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="space-y-6">
          <div className="inline-block text-[11px] font-mono tracking-[0.25em] uppercase px-3 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full">
            {locationData.primary_keyword || 'Fashion & Editorial Photography'}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1]">
            {locationData.seo_title || `${locationData.location_name} Photography Studio`}
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
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">Regional Vision & Practice</h2>
            <div className="text-sm sm:text-base leading-relaxed space-y-4 text-neutral-800 dark:text-neutral-300 font-sans">
              {locationData.location_content ? (
                <p className="whitespace-pre-line">{locationData.location_content}</p>
              ) : (
                <p>
                  Gold Akingbade produces distinct visual narratives across {locationData.location_name} and the wider {locationData.state} landscape. Combining deep tonal balance, editorial precision, and intimate portraiture, each commission captures the authentic character and artistic pulse of the region.
                </p>
              )}
            </div>
          </div>

          {/* Services & Deliverables */}
          <div className="space-y-4 p-6 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">Services in {locationData.location_name}</h2>
            <ul className="space-y-2.5 text-xs font-mono">
              {(locationData.services_offered && locationData.services_offered.length > 0
                ? locationData.services_offered
                : [
                    'Editorial & Runway Photography',
                    'High Fashion Lookbooks',
                    'Documentary & Culture Features',
                    'Commercial Brand Campaigns',
                    'Fine Art Portrait Sessions',
                  ]
              ).map((service: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <a
                href={`mailto:studio@goldakingbade.com?subject=Inquiry: ${locationData.location_name} Photography Booking`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-xl text-xs font-mono uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Book a Session</span>
              </a>
            </div>
          </div>
        </section>

        {/* Featured Projects in Nigeria */}
        {projects.length > 0 && (
          <section className="space-y-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-mono uppercase tracking-[0.2em] opacity-60">Featured Archive Portfolios</h2>
                <p className="text-sm font-serif mt-1">Curated collections produced across Nigeria</p>
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
