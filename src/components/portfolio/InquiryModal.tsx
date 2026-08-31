import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { InquiryFormData } from '../../types/portfolio';
import { publicApiService } from '../../services/publicApiService';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    projectType: 'Editorial & Fashion',
    timeline: 'Within 1-2 Months',
    message: '',
    budget: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await publicApiService.submitInquiry(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(res.message || 'Failed to transmit inquiry');
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      projectType: 'Editorial & Fashion',
      timeline: 'Within 1-2 Months',
      message: '',
      budget: '',
    });
    onClose();
  };

  return (
    <div
      id="inquiry-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#111111]/70 backdrop-blur-[2px] transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="inquiry-modal-container"
        className="w-full max-w-xl bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] border border-[#E2DFD2] dark:border-[#262626] p-6 sm:p-8 md:p-10 relative shadow-2xl transition-colors duration-300"
      >
        {/* Close action */}
        <button
          id="btn-close-inquiry"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 opacity-60 hover:opacity-100 transition-opacity cursor-pointer p-1"
          aria-label="Close inquiry modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-10 h-10 mx-auto border border-current flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl italic">Inquiry Received</h2>
            <p className="font-editorial-sans text-xs tracking-[0.18em] opacity-75 max-w-sm mx-auto leading-relaxed uppercase">
              Thank you, {formData.name || 'Friend'}. Gold Akingbade and studio management will review your commission request and reply within 48 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="font-editorial-sans text-[11px] tracking-[0.24em] uppercase border-b border-current pb-0.5 hover:opacity-70 transition-opacity"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-1 mb-8">
              <span className="font-editorial-sans text-[10px] tracking-[0.25em] uppercase opacity-60">
                Studio Commission & Booking
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl">Collaboration Inquiry</h2>
              <p className="font-editorial-sans text-[11px] tracking-[0.15em] opacity-70 uppercase">
                Direct editorial, campaign, or art direction inquiries.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 font-editorial-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="inquiry-name" className="block tracking-[0.2em] uppercase text-[10px] opacity-70">
                    Your Name / Brand *
                  </label>
                  <input
                    id="inquiry-name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vogue Africa / Folake Ade"
                    className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 focus:border-[#111111] dark:focus:border-[#FEFDF3] py-2 px-0 outline-none text-xs tracking-wider transition-colors placeholder:opacity-30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiry-email" className="block tracking-[0.2em] uppercase text-[10px] opacity-70">
                    Email Address *
                  </label>
                  <input
                    id="inquiry-email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@organization.com"
                    className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 focus:border-[#111111] dark:focus:border-[#FEFDF3] py-2 px-0 outline-none text-xs tracking-wider transition-colors placeholder:opacity-30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="inquiry-type" className="block tracking-[0.2em] uppercase text-[10px] opacity-70">
                    Project Scope
                  </label>
                  <select
                    id="inquiry-type"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 focus:border-[#111111] dark:focus:border-[#FEFDF3] py-2 px-0 outline-none text-xs tracking-wider transition-colors"
                  >
                    <option value="Editorial & Fashion" className="bg-[#FEFDF3] dark:bg-[#111111]">
                      Editorial & Fashion Lookbook
                    </option>
                    <option value="Art Direction & Campaign" className="bg-[#FEFDF3] dark:bg-[#111111]">
                      Art Direction & Brand Campaign
                    </option>
                    <option value="Portrait Commission" className="bg-[#FEFDF3] dark:bg-[#111111]">
                      Fine Art Portrait Commission
                    </option>
                    <option value="Exhibition / Print Sale" className="bg-[#FEFDF3] dark:bg-[#111111]">
                      Exhibition & Print Acquisition
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inquiry-timeline" className="block tracking-[0.2em] uppercase text-[10px] opacity-70">
                    Target Timeline
                  </label>
                  <select
                    id="inquiry-timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 focus:border-[#111111] dark:focus:border-[#FEFDF3] py-2 px-0 outline-none text-xs tracking-wider transition-colors"
                  >
                    <option value="Immediate (< 1 month)" className="bg-[#FEFDF3] dark:bg-[#111111]">Immediate (Within 30 Days)</option>
                    <option value="Within 1-2 Months" className="bg-[#FEFDF3] dark:bg-[#111111]">Within 1–2 Months</option>
                    <option value="Q3 / Q4 2026" className="bg-[#FEFDF3] dark:bg-[#111111]">Q3 / Q4 2026</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inquiry-message" className="block tracking-[0.2em] uppercase text-[10px] opacity-70">
                  Concept Brief & Location *
                </label>
                <textarea
                  id="inquiry-message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your creative direction, location (Lagos, London, New York, etc.), and deliverables..."
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 focus:border-[#111111] dark:focus:border-[#FEFDF3] py-2 px-0 outline-none text-xs tracking-wider transition-colors placeholder:opacity-30 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-[9px] tracking-[0.2em] uppercase opacity-50">
                  Akure / Lagos / Global
                </span>
                <button
                  id="btn-submit-inquiry"
                  type="submit"
                  disabled={loading}
                  className="font-editorial-sans text-[11px] tracking-[0.24em] uppercase border-b-2 border-current pb-0.5 hover:opacity-75 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Transmitting...' : 'Submit Inquiry →'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
