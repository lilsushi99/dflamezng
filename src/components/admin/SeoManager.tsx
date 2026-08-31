import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Plus,
  Save,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { GlobalSeoSettings, SeoLocation } from '../../types/admin';
import { adminApiService } from '../../services/adminApiService';

export const SeoManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'global' | 'locations'>('global');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Global SEO state
  const [globalSeo, setGlobalSeo] = useState<GlobalSeoSettings>({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    canonical_url: '',
    robots_rules: 'User-agent: *\nAllow: /\nSitemap: /sitemap.xml',
    schema_json: '',
  });

  // Locations state
  const [locations, setLocations] = useState<SeoLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SeoLocation | null>(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  // Location Form
  const [locationForm, setLocationForm] = useState<{
    location_name: string;
    state: string;
    url_slug: string;
    seo_title: string;
    meta_description: string;
    primary_keyword: string;
    secondary_keywords: string;
    location_content: string;
    services_offered: string[];
    is_published: boolean;
    is_indexable: boolean;
    sitemap_priority: number;
  }>({
    location_name: '',
    state: '',
    url_slug: '',
    seo_title: '',
    meta_description: '',
    primary_keyword: 'Fashion & Editorial Photography',
    secondary_keywords: '',
    location_content: '',
    services_offered: [
      'Editorial & Runway Photography',
      'High Fashion Lookbooks',
      'Documentary & Culture Features',
      'Commercial Brand Campaigns',
      'Fine Art Portrait Sessions',
    ],
    is_published: true,
    is_indexable: true,
    sitemap_priority: 0.8,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [globalRes, locationsRes] = await Promise.all([
        adminApiService.getGlobalSeo(),
        adminApiService.getAllLocations(),
      ]);
      if (globalRes && globalRes.seo) setGlobalSeo(globalRes.seo);
      if (locationsRes) setLocations(locationsRes);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load SEO data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveGlobalSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      const updated = await adminApiService.updateGlobalSeo(globalSeo);
      setGlobalSeo(updated);
      setFeedback({ type: 'success', message: 'Global SEO parameters & metadata updated successfully' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save global SEO' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleOpenNewLocation = () => {
    setSelectedLocation(null);
    setLocationForm({
      location_name: '',
      state: '',
      url_slug: '',
      seo_title: '',
      meta_description: '',
      primary_keyword: 'Fashion & Editorial Photography',
      secondary_keywords: '',
      location_content: '',
      services_offered: [
        'Editorial & Runway Photography',
        'High Fashion Lookbooks',
        'Documentary & Culture Features',
        'Commercial Brand Campaigns',
        'Fine Art Portrait Sessions',
      ],
      is_published: true,
      is_indexable: true,
      sitemap_priority: 0.8,
    });
    setIsEditingLocation(true);
  };

  const handleEditLocation = (loc: SeoLocation) => {
    setSelectedLocation(loc);
    setLocationForm({
      location_name: loc.location_name,
      state: loc.state,
      url_slug: loc.url_slug.startsWith('/') ? loc.url_slug.substring(1) : loc.url_slug,
      seo_title: loc.seo_title,
      meta_description: loc.meta_description,
      primary_keyword: loc.primary_keyword || 'Fashion & Editorial Photography',
      secondary_keywords: loc.secondary_keywords || '',
      location_content: loc.location_content,
      services_offered: loc.services_offered || [],
      is_published: loc.is_published,
      is_indexable: loc.is_indexable,
      sitemap_priority: loc.sitemap_priority || 0.8,
    });
    setIsEditingLocation(true);
  };

  const handleAutoGenerateFields = () => {
    if (!locationForm.location_name) return;
    const city = locationForm.location_name.trim();
    const state = locationForm.state ? ` ${locationForm.state.trim()}` : '';
    const generatedSlug = `${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-fashion-photographer`;
    setLocationForm((prev) => ({
      ...prev,
      url_slug: prev.url_slug || generatedSlug,
      seo_title: `${city} Fashion & Portrait Photographer | Editorial Photography`,
      meta_description: `Award-winning fashion and editorial portrait photography services in ${city}${state}, Nigeria by Gold Akingbade. Available for campaigns and commissions.`,
      primary_keyword: `${city} Fashion Photographer`,
      secondary_keywords: `${city} Portrait Photographer, Editorial Photography in ${city}, Lookbook Photography ${state}`,
      location_content: `Gold Akingbade produces distinct visual narratives across ${city} and the wider ${state || 'Nigeria'} region. Combining deep tonal balance, editorial precision, and intimate portraiture, each commission captures the authentic character and artistic pulse of the area.`,
    }));
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.url_slug || !locationForm.location_name) return;

    setIsSaving(true);
    setFeedback(null);
    try {
      const cleanSlug = locationForm.url_slug.startsWith('/')
        ? locationForm.url_slug
        : `/${locationForm.url_slug}`;

      const payload = {
        ...locationForm,
        url_slug: cleanSlug,
      };

      if (selectedLocation) {
        const updated = await adminApiService.updateLocation(selectedLocation.id, payload);
        setLocations((prev) => prev.map((l) => (l.id === selectedLocation.id ? updated : l)));
        setFeedback({ type: 'success', message: `Updated location page for ${updated.location_name}` });
      } else {
        const created = await adminApiService.createLocation(payload);
        setLocations((prev) => [created, ...prev]);
        setFeedback({ type: 'success', message: `Created location page for ${created.location_name}` });
      }
      setIsEditingLocation(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save location page' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this location page?')) return;
    try {
      await adminApiService.deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
      setFeedback({ type: 'success', message: 'Location page deleted' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to delete location page' });
    }
  };

  const filteredLocations = locations.filter(
    (l) =>
      l.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-sm font-mono text-neutral-400">Loading SEO infrastructure...</p>
      </div>
    );
  }

  return (
    <div id="admin-seo-manager" className="space-y-8">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-mono tracking-wide animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
              : 'bg-red-950/50 border-red-800 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
            activeTab === 'global'
              ? 'bg-neutral-100 text-neutral-950 font-semibold'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          GLOBAL SEO & CRAWLER SCHEMA
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
            activeTab === 'locations'
              ? 'bg-neutral-100 text-neutral-950 font-semibold'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          NIGERIAN LOCATION HUBS ({locations.length})
        </button>
      </div>

      {/* TAB 1: GLOBAL SEO */}
      {activeTab === 'global' && (
        <form onSubmit={handleSaveGlobalSeo} className="space-y-6">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-semibold text-neutral-100">Global Search Meta Tags</h3>
                <p className="text-xs text-neutral-400">
                  Default title, descriptions, open graph cards, and canonical definitions.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                SAVE GLOBAL SEO
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  value={globalSeo.meta_title}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, meta_title: e.target.value })}
                  placeholder="Gold Akingbade | Fashion & Fine Art Photographer | Nigeria"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={globalSeo.canonical_url}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, canonical_url: e.target.value })}
                  placeholder="https://goldakingbade.com"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={globalSeo.meta_description}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, meta_description: e.target.value })}
                  placeholder="Official portfolio of Gold Akingbade..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={globalSeo.meta_keywords}
                  onChange={(e) => setGlobalSeo({ ...globalSeo, meta_keywords: e.target.value })}
                  placeholder="fashion photography, editorial photographer nigeria, lagos fashion photographer..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </section>
        </form>
      )}

      {/* TAB 2: LOCATION PAGES */}
      {activeTab === 'locations' && (
        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <h3 className="text-base font-semibold text-neutral-100">
                Indexable Location Pages & City Keywords ({locations.length})
              </h3>
              <p className="text-xs text-neutral-400">
                74 targeted Nigerian city and state landing hubs for organic search discovery.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenNewLocation}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              ADD NEW LOCATION
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations by city, state, or slug..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Location modal / editor */}
          {isEditingLocation && (
            <div className="p-6 bg-neutral-950 border border-amber-400/50 rounded-2xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <h4 className="text-sm font-semibold text-neutral-100 font-mono uppercase">
                  {selectedLocation ? `Edit Location: ${selectedLocation.location_name}` : 'Create Location Page'}
                </h4>
                <button
                  type="button"
                  onClick={handleAutoGenerateFields}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-mono rounded-lg transition-colors cursor-pointer border border-neutral-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Auto-Generate Copy from City
                </button>
              </div>

              <form onSubmit={handleSaveLocation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">City / Hub Name *</label>
                    <input
                      type="text"
                      required
                      value={locationForm.location_name}
                      onChange={(e) => setLocationForm({ ...locationForm, location_name: e.target.value })}
                      placeholder="e.g. Lagos"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">State / Region</label>
                    <input
                      type="text"
                      value={locationForm.state}
                      onChange={(e) => setLocationForm({ ...locationForm, state: e.target.value })}
                      placeholder="e.g. Lagos State"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={locationForm.url_slug}
                      onChange={(e) => setLocationForm({ ...locationForm, url_slug: e.target.value })}
                      placeholder="e.g. lagos-fashion-photographer"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Page Title Tag</label>
                  <input
                    type="text"
                    required
                    value={locationForm.seo_title}
                    onChange={(e) => setLocationForm({ ...locationForm, seo_title: e.target.value })}
                    placeholder="Lagos Fashion Photographer | Editorial Portfolio"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={locationForm.meta_description}
                    onChange={(e) => setLocationForm({ ...locationForm, meta_description: e.target.value })}
                    placeholder="Editorial and portrait photography in Lagos..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Primary Keyword</label>
                  <input
                    type="text"
                    value={locationForm.primary_keyword}
                    onChange={(e) => setLocationForm({ ...locationForm, primary_keyword: e.target.value })}
                    placeholder="Lagos Fashion Photographer"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">Regional Editorial Story</label>
                  <textarea
                    rows={4}
                    value={locationForm.location_content}
                    onChange={(e) => setLocationForm({ ...locationForm, location_content: e.target.value })}
                    placeholder="Detailed regional portfolio description..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-300">
                      <input
                        type="checkbox"
                        checked={locationForm.is_published}
                        onChange={(e) => setLocationForm({ ...locationForm, is_published: e.target.checked })}
                        className="rounded bg-neutral-900 border-neutral-700 text-amber-400"
                      />
                      <span>Published Live</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-300">
                      <input
                        type="checkbox"
                        checked={locationForm.is_indexable}
                        onChange={(e) => setLocationForm({ ...locationForm, is_indexable: e.target.checked })}
                        className="rounded bg-neutral-900 border-neutral-700 text-amber-400"
                      />
                      <span>Included in Sitemap.xml</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingLocation(false)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl font-mono"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save Location Page
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Location list */}
          <div className="space-y-2">
            {filteredLocations.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40">
                <p className="text-xs text-neutral-400">No location pages found matching your search</p>
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const cleanSlug = loc.url_slug.startsWith('/') ? loc.url_slug.substring(1) : loc.url_slug;
                return (
                  <div
                    key={loc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl gap-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-neutral-100">{loc.location_name}</span>
                        {loc.state && (
                          <span className="text-xs text-neutral-400 font-mono">({loc.state})</span>
                        )}
                        <span className="text-[10px] font-mono bg-neutral-800 text-amber-300 px-2 py-0.5 rounded">
                          /location/{cleanSlug}
                        </span>
                        {!loc.is_published && (
                          <span className="text-[10px] font-mono bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800/40">
                            DRAFT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1">{loc.seo_title}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/location/${cleanSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
                        title="View live location page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleEditLocation(loc)}
                        className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Edit page content"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLocation(loc.id)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                        title="Delete page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
};
