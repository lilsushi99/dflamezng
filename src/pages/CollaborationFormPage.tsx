import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

interface CollaborationFormPageProps {
  onNavigateHome: () => void;
}

export const CollaborationFormPage: React.FC<CollaborationFormPageProps> = ({
  onNavigateHome,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneWhatsapp: '',
    projectType: 'fashion-editorial',
    estimatedDate: '',
    location: '',
    budgetRange: 'tier-2',
    message: '',
  });

  useEffect(() => {
    document.title = 'Collaboration Inquiry — Good Akingbade';
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepared for future Express & MySQL backend connection
    setIsSubmitted(true);
  };

  return (
    <main
      id="collaboration-form-page"
      className="min-h-screen w-full bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400 select-none px-5 sm:px-8 md:px-12 pt-20 sm:pt-28 pb-20 sm:pb-32"
    >
      {/* Top Fixed Minimal Navigation Bar */}
      <nav
        aria-label="Form Navigation"
        className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 md:px-12 py-4 md:py-6 flex items-center justify-between text-xs tracking-[0.22em] uppercase font-editorial-sans bg-[#FEFDF3]/95 dark:bg-[#111111]/95 backdrop-blur-[4px] border-b border-[#111111]/5 dark:border-[#FEFDF3]/5 transition-colors duration-400"
      >
        <button
          onClick={onNavigateHome}
          className="group inline-flex items-center space-x-2 opacity-75 hover:opacity-100 transition-opacity cursor-pointer py-1 pr-3"
          aria-label="Return to canvas"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="font-medium text-[11px] sm:text-xs tracking-[0.24em]">Home</span>
        </button>

        <div className="hidden sm:block text-[10px] tracking-[0.25em] opacity-50">
          Direct Studio Commission
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer py-1"
          >
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5 stroke-[1.5]" />
            ) : (
              <Sun className="w-3.5 h-3.5 stroke-[1.5]" />
            )}
            <span className="hidden md:inline text-[10px] tracking-[0.2em]">
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
          </button>
          <span className="font-medium opacity-80 text-[11px] sm:text-xs tracking-[0.22em]">
            Good Akingbade
          </span>
        </div>
      </nav>

      {/* Main Form Editorial Container */}
      <div className="max-w-3xl mx-auto">
        {/* Editorial Heading */}
        <header className="space-y-4 mb-12 sm:mb-16 border-b border-[#111111]/15 dark:border-[#FEFDF3]/15 pb-8 sm:pb-10">
          <div className="flex items-center space-x-3 font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.26em] uppercase opacity-60">
            <span>Commission Inquiries</span>
            <span>/</span>
            <span>2025–2026 Studio Schedule</span>
          </div>
          <h1 className="font-editorial-serif font-light text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05]">
            Initiate a Collaboration
          </h1>
          <p className="font-editorial-serif italic text-lg sm:text-xl md:text-2xl opacity-80 leading-relaxed max-w-xl">
            “Every commission begins with shared intention, light, and architectural form.”
          </p>
        </header>

        {isSubmitted ? (
          <div
            id="form-confirmation-panel"
            className="border border-[#111111]/15 dark:border-[#FEFDF3]/15 p-8 sm:p-12 space-y-6 text-center"
          >
            <div className="w-10 h-10 border border-current mx-auto flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal">
              Inquiry Dispatched
            </h2>
            <p className="font-editorial-sans text-xs sm:text-sm tracking-wider opacity-75 max-w-md mx-auto leading-relaxed">
              Thank you, {formData.name || 'esteemed collaborator'}. The studio will review your project brief and respond within two business days.
            </p>
            <div className="pt-4">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center space-x-2 font-editorial-sans text-xs tracking-[0.22em] uppercase border-b border-current pb-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Exhibition Canvas</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            id="collaboration-inquiry-form"
            onSubmit={handleSubmit}
            className="space-y-8 sm:space-y-10 font-editorial-sans"
          >
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label
                  htmlFor="field-name"
                  className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
                >
                  Name / Organisation *
                </label>
                <input
                  id="field-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Folake Adeleke"
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="field-email"
                  className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
                >
                  Email Address *
                </label>
                <input
                  id="field-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
                />
              </div>
            </div>

            {/* Row 2: Phone/WhatsApp and Project Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label
                  htmlFor="field-phone"
                  className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
                >
                  Phone / WhatsApp
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  name="phoneWhatsapp"
                  value={formData.phoneWhatsapp}
                  onChange={handleChange}
                  placeholder="+234 ..."
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="field-type"
                  className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
                >
                  Project Discipline *
                </label>
                <select
                  id="field-type"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-xs sm:text-sm focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none uppercase tracking-wider cursor-pointer"
                >
                  <option value="fashion-editorial" className="bg-[#FEFDF3] dark:bg-[#111111]">
                    Fashion Editorial / Spread
                  </option>
                  <option value="brand-campaign" className="bg-[#FEFDF3] dark:bg-[#111111]">
                    Brand Campaign & Art Direction
                  </option>
                  <option value="portrait-commission" className="bg-[#FEFDF3] dark:bg-[#111111]">
                    Private Portrait Monograph
                  </option>
                  <option value="cultural-documentary" className="bg-[#FEFDF3] dark:bg-[#111111]">
                    Cultural Documentary / Research
                  </option>
                  <option value="exhibition-print" className="bg-[#FEFDF3] dark:bg-[#111111]">
                    Gallery Acquisition / Exhibition Print
                  </option>
                </select>
              </div>
            </div>

            {/* Row 3: Estimated Date and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label
                  htmlFor="field-date"
                  className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
                >
                  Target Timeline / Date
                </label>
                <input
                  id="field-date"
                  type="text"
                  name="estimatedDate"
                  value={formData.estimatedDate}
                  onChange={handleChange}
                  placeholder="e.g. Autumn 2025 or Q1 2026"
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="field-location"
                  className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
                >
                  Production Location
                </label>
                <input
                  id="field-location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lagos, London, Paris, or Ondo"
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
                />
              </div>
            </div>

            {/* Row 4: Budget Range */}
            <div className="space-y-2">
              <label
                htmlFor="field-budget"
                className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
              >
                Estimated Budget Bracket
              </label>
              <select
                id="field-budget"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-xs sm:text-sm focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none uppercase tracking-wider cursor-pointer"
              >
                <option value="tier-1" className="bg-[#FEFDF3] dark:bg-[#111111]">
                  $3,000 – $7,500 (Editorial / Lookbook)
                </option>
                <option value="tier-2" className="bg-[#FEFDF3] dark:bg-[#111111]">
                  $7,500 – $15,000 (Commercial Campaign)
                </option>
                <option value="tier-3" className="bg-[#FEFDF3] dark:bg-[#111111]">
                  $15,000+ (Full Art Direction & Multi-day)
                </option>
                <option value="institutional" className="bg-[#FEFDF3] dark:bg-[#111111]">
                  Institutional / Museum / Grant-funded
                </option>
              </select>
            </div>

            {/* Row 5: Concept Narrative Message */}
            <div className="space-y-2">
              <label
                htmlFor="field-message"
                className="block text-[10px] tracking-[0.2em] uppercase opacity-70"
              >
                Concept Brief / Vision Notes *
              </label>
              <textarea
                id="field-message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your creative intention, references, key deliverables, and mood..."
                className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30 resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                type="submit"
                id="btn-submit-collaboration"
                className="group inline-flex items-center space-x-2 border border-current px-6 py-3 text-xs tracking-[0.24em] uppercase opacity-85 hover:opacity-100 transition-all cursor-pointer"
              >
                <span>Submit Brief</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <span className="text-[9px] tracking-[0.2em] uppercase opacity-50">
                Direct transmission to Good Akingbade Studio
              </span>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};
