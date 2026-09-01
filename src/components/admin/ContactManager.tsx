import React, { useState, useEffect } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  Phone,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Sparkles,
  Inbox,
  User,
  Calendar,
} from 'lucide-react';
import { adminApiService } from '../../services/adminApiService';

export const ContactManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'inquiries'>('settings');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings State
  const [contactSettings, setContactSettings] = useState<{
    contact_email: string;
    contact_phone: string;
    location_text: string;
    is_available: boolean;
    availability_text: string;
    studio_name: string;
    photographer_name: string;
    about_title?: string;
    about_statement?: string;
    about_story?: string;
    about_services?: string;
  }>({
    contact_email: 'studio@goldakingbade.com',
    contact_phone: '+234 812 345 6789',
    location_text: 'Akure / Lagos / Nigeria',
    is_available: true,
    availability_text: 'Open to Travel — Worldwide & Commissions',
    studio_name: 'GOLD AKINGBADE STUDIO',
    photographer_name: 'Gold Akingbade',
    about_title: 'ABOUT THE STUDIO',
    about_statement: 'Good Akinbade is a Nigerian fashion, portrait, and editorial art direction photographer based in Akure and Lagos.',
    about_story: 'Blending classical African aesthetics with contemporary high-fashion narrative, the studio creates timeless visual archives for international lookbooks, publications, and private collections.',
    about_services: 'Fashion Lookbooks, Editorial Campaigns, Portraiture, Creative Direction, Commercial Visual Production',
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, inquiriesRes, siteSettingsRes] = await Promise.all([
        adminApiService.getContactSettings(),
        adminApiService.getInquiries(),
        adminApiService.getSiteSettings().catch(() => ({})),
      ]);
      if (settingsRes) {
        setContactSettings({
          contact_email: settingsRes.contact_email || 'studio@goldakingbade.com',
          contact_phone: settingsRes.contact_phone || '+234 812 345 6789',
          location_text: settingsRes.location_text || 'Akure / Lagos / Nigeria',
          is_available: settingsRes.is_available !== false,
          availability_text: settingsRes.availability_text || 'Open to Travel — Worldwide & Commissions',
          studio_name: settingsRes.studio_name || 'GOLD AKINGBADE STUDIO',
          photographer_name: settingsRes.photographer_name || 'Good Akinbade',
          about_title: siteSettingsRes?.about_title || 'ABOUT THE STUDIO',
          about_statement: siteSettingsRes?.about_statement || 'Good Akinbade is a Nigerian fashion, portrait, and editorial art direction photographer based in Akure and Lagos.',
          about_story: siteSettingsRes?.about_story || 'Blending classical African aesthetics with contemporary high-fashion narrative, the studio creates timeless visual archives for international lookbooks, publications, and private collections.',
          about_services: siteSettingsRes?.about_services || 'Fashion Lookbooks, Editorial Campaigns, Portraiture, Creative Direction, Commercial Visual Production',
        });
      }
      if (inquiriesRes) {
        setInquiries(inquiriesRes);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load contact settings' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      await Promise.all([
        adminApiService.updateContactSettings(contactSettings),
        adminApiService.updateSiteSettings({
          about_title: contactSettings.about_title,
          about_statement: contactSettings.about_statement,
          about_story: contactSettings.about_story,
          about_services: contactSettings.about_services,
          location_text: contactSettings.location_text,
          is_available: contactSettings.is_available,
          availability_text: contactSettings.availability_text,
          contact_email: contactSettings.contact_email,
          contact_phone: contactSettings.contact_phone,
        }),
      ]);
      setFeedback({ type: 'success', message: 'Studio contacts, biography & availability published successfully' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save contact settings' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleUpdateInquiryStatus = async (id: number, status: 'NEW' | 'REVIEWED' | 'ARCHIVED') => {
    try {
      const updated = await adminApiService.updateInquiry(id, { status });
      setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(updated);
      }
    } catch (err: any) {
      alert('Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      await adminApiService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch (err: any) {
      alert('Failed to delete inquiry');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
        <p className="text-sm font-mono text-neutral-400">Loading contacts & inquiries...</p>
      </div>
    );
  }

  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;

  return (
    <div id="admin-contact-manager" className="space-y-6">
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-mono tracking-wide ${
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

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-neutral-100 text-neutral-950 font-semibold'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          LOCATION, AVAILABILITY & DIRECT CONTACT
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
            activeSubTab === 'inquiries'
              ? 'bg-neutral-100 text-neutral-950 font-semibold'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          CLIENT INQUIRIES ({inquiries.length})
          {newInquiriesCount > 0 && (
            <span className="bg-amber-400 text-neutral-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {newInquiriesCount} NEW
            </span>
          )}
        </button>
      </div>

      {/* SUB-TAB 1: SETTINGS */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-semibold text-neutral-100">Studio Geographic & Booking Settings</h3>
                <p className="text-xs text-neutral-400">
                  Controls the live Location & Availability indicators rendered across the public masthead and footer.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                SAVE CONTACT SETTINGS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Text */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Location Indicator (e.g. Primary / Region)
                </label>
                <input
                  type="text"
                  value={contactSettings.location_text}
                  onChange={(e) => setContactSettings({ ...contactSettings, location_text: e.target.value })}
                  placeholder="Akure / Lagos / Nigeria"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Format with '/' to split into main heading and subline. Example: "Akure / Lagos / Nigeria"
                </p>
              </div>

              {/* Availability Text */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Availability Text (e.g. Primary — Secondary)
                </label>
                <input
                  type="text"
                  value={contactSettings.availability_text}
                  onChange={(e) => setContactSettings({ ...contactSettings, availability_text: e.target.value })}
                  placeholder="Open to Travel — Worldwide & Commissions"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Format with '—' to split into status and subtitle. Example: "Open to Travel — Worldwide & Commissions"
                </p>
              </div>

              {/* Direct Email */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Studio Contact Email
                </label>
                <input
                  type="email"
                  value={contactSettings.contact_email}
                  onChange={(e) => setContactSettings({ ...contactSettings, contact_email: e.target.value })}
                  placeholder="studio@goldakingbade.com"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>

              {/* Direct Phone */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Studio Phone / WhatsApp Line
                </label>
                <input
                  type="tel"
                  value={contactSettings.contact_phone}
                  onChange={(e) => setContactSettings({ ...contactSettings, contact_phone: e.target.value })}
                  placeholder="+234 812 345 6789"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>

              {/* Availability Toggle */}
              <div className="md:col-span-2 pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-neutral-950/60 border border-neutral-800 rounded-xl">
                  <input
                    type="checkbox"
                    checked={contactSettings.is_available}
                    onChange={(e) => setContactSettings({ ...contactSettings, is_available: e.target.checked })}
                    className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-amber-400"
                  />
                  <div>
                    <span className="text-xs font-mono uppercase text-neutral-200 block font-semibold">
                      Accepting New Commissions & Editorial Bookings
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      When checked, the availability badge shows live status for creative projects.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* About / Studio Manifesto Section */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="text-base font-semibold text-neutral-100">About the Studio & Curatorial Manifesto</h3>
              <p className="text-xs text-neutral-400">
                Official biography, artistic philosophy, and services rendered across editorial and commercial portfolios.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Section Header Title
                </label>
                <input
                  type="text"
                  value={contactSettings.about_title || ''}
                  onChange={(e) => setContactSettings({ ...contactSettings, about_title: e.target.value })}
                  placeholder="ABOUT THE STUDIO"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono uppercase text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Core Artistic Statement / Hook
                </label>
                <textarea
                  rows={2}
                  value={contactSettings.about_statement || ''}
                  onChange={(e) => setContactSettings({ ...contactSettings, about_statement: e.target.value })}
                  placeholder="Good Akinbade is a Nigerian fashion, portrait, and editorial art direction photographer based in Akure and Lagos."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Studio Story & Curatorial Background
                </label>
                <textarea
                  rows={4}
                  value={contactSettings.about_story || ''}
                  onChange={(e) => setContactSettings({ ...contactSettings, about_story: e.target.value })}
                  placeholder="Blending classical African aesthetics with contemporary high-fashion narrative, the studio creates timeless visual archives for international lookbooks, publications, and private collections."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Creative Services & Capabilities
                </label>
                <input
                  type="text"
                  value={contactSettings.about_services || ''}
                  onChange={(e) => setContactSettings({ ...contactSettings, about_services: e.target.value })}
                  placeholder="Fashion Lookbooks, Editorial Campaigns, Portraiture, Creative Direction, Commercial Visual Production"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>
            </div>
          </section>
        </form>
      )}

      {/* SUB-TAB 2: INQUIRIES LIST */}
      {activeSubTab === 'inquiries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List */}
          <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 max-h-[700px] overflow-y-auto">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-2">
              All Inquiries ({inquiries.length})
            </h4>

            {inquiries.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl">
                <Inbox className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-400 font-mono">No inquiries received yet</p>
              </div>
            ) : (
              inquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <button
                    key={inq.id}
                    type="button"
                    onClick={() => setSelectedInquiry(inq)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-800 border-amber-400/80 shadow-sm ring-1 ring-amber-400/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-neutral-100 truncate">{inq.name}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-medium ${
                          inq.status === 'NEW'
                            ? 'bg-amber-400 text-neutral-950'
                            : inq.status === 'REVIEWED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 truncate mb-1">{inq.project_type}</div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Detail */}
          <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
            {selectedInquiry ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-neutral-100 font-serif">{selectedInquiry.name}</h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-medium ${
                          selectedInquiry.status === 'NEW'
                            ? 'bg-amber-400 text-neutral-950'
                            : selectedInquiry.status === 'REVIEWED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {selectedInquiry.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono">
                      Received {new Date(selectedInquiry.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as any)}
                      className="bg-neutral-950 border border-neutral-700 text-xs font-mono text-neutral-200 rounded-xl px-3 py-1.5"
                    >
                      <option value="NEW">Mark NEW</option>
                      <option value="REVIEWED">Mark REVIEWED</option>
                      <option value="ARCHIVED">Mark ARCHIVED</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-800"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Email Address</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-amber-400 hover:underline block font-mono"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>

                  <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Project Scope</span>
                    <span className="text-neutral-200 block font-medium">{selectedInquiry.project_type}</span>
                  </div>

                  <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Target Timeline</span>
                    <span className="text-neutral-200 block">{selectedInquiry.timeline}</span>
                  </div>

                  {selectedInquiry.budget && (
                    <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">Budget</span>
                      <span className="text-neutral-200 block">{selectedInquiry.budget}</span>
                    </div>
                  )}
                </div>

                {/* Concept Brief & Location Message */}
                <div className="p-5 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    Concept Brief & Creative Deliverables
                  </span>
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {selectedInquiry.message}
                  </p>
                </div>

                {/* Quick Reply button */}
                <div className="flex justify-end pt-2">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=RE: Studio Collaboration Inquiry - Gold Akingbade&body=Hello ${selectedInquiry.name},%0D%0A%0D%0AThank you for reaching out regarding your ${selectedInquiry.project_type} project.%0D%0A`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 text-xs font-semibold rounded-xl tracking-wider transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    REPLY VIA EMAIL CLIENT
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-neutral-500 space-y-2">
                <Inbox className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
                <p className="text-sm font-serif text-neutral-300">Select an inquiry to view full concept brief</p>
                <p className="text-xs font-mono text-neutral-500">
                  Client inquiries submitted from the public portfolio are stored here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
