import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';
import { publicApiService } from '../services/publicApiService';

interface CollaborationFormPageProps {
  onNavigateHome: () => void;
  onNavigateTerms?: () => void;
}

export const CollaborationFormPage: React.FC<CollaborationFormPageProps> = ({
  onNavigateHome,
  onNavigateTerms,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [subtext, setSubtext] = useState(
    publicApiService.getState().bookingPageSubtext ||
      'Once you and the creative agree on the direction of your project, this form is used to make the official booking.'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectLocation: '',
    budget: '',
    projectBrief: '',
  });

  useEffect(() => {
    document.title = 'Book Us — Gold Akingbade';
    window.scrollTo(0, 0);
    const unsubscribe = publicApiService.subscribe((state) => {
      if (state.bookingPageSubtext) setSubtext(state.bookingPageSubtext);
    });
    return unsubscribe;
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    const result = await publicApiService.submitInquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      projectLocation: formData.projectLocation.trim(),
      budget: formData.budget.trim() || undefined,
      projectBrief: formData.projectBrief.trim(),
    });
    setIsSubmitting(false);
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMsg(result.message || 'Failed to submit booking. Please try again.');
    }
  };

  const firstName = formData.name.trim().split(/\s+/)[0] || 'there';

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
          Studio Booking
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
        </div>
      </nav>

      {/* Main Form Editorial Container */}
      <div className="max-w-2xl mx-auto">
        {/* Editorial Heading */}
        <header className="space-y-4 mb-12 sm:mb-16 border-b border-[#111111]/15 dark:border-[#FEFDF3]/15 pb-8 sm:pb-10">
          <h1 className="font-editorial-serif font-light text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.05]">
            Book Us
          </h1>
          <p className="font-editorial-sans text-sm sm:text-base opacity-75 leading-relaxed max-w-xl">
            {subtext}
          </p>
          <button
            type="button"
            onClick={onNavigateTerms}
            className="inline-block text-xs tracking-[0.18em] uppercase underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            Read our Terms & Conditions
          </button>
        </header>

        {isSubmitted ? (
          <div
            id="form-confirmation-panel"
            className="border border-[#111111]/15 dark:border-[#FEFDF3]/15 p-8 sm:p-12 space-y-6 text-center"
          >
            <div className="w-10 h-10 border border-current mx-auto flex items-center justify-center rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal">
              Booking Received
            </h2>
            <p className="font-editorial-sans text-xs sm:text-sm tracking-wide opacity-75 max-w-md mx-auto leading-relaxed">
              Hello {firstName}, we have received your booking. Someone from our team would reach out to you in less than an hour. Do well to check your email or WhatsApp.
            </p>
            <div className="pt-4">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center space-x-2 font-editorial-sans text-xs tracking-[0.22em] uppercase border-b border-current pb-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            id="booking-form"
            onSubmit={handleSubmit}
            className="space-y-8 sm:space-y-10 font-editorial-sans"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label htmlFor="field-name" className="block text-[10px] tracking-[0.2em] uppercase opacity-70">
                  Name *
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
                <label htmlFor="field-email" className="block text-[10px] tracking-[0.2em] uppercase opacity-70">
                  Email *
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label htmlFor="field-phone" className="block text-[10px] tracking-[0.2em] uppercase opacity-70">
                  Phone / WhatsApp *
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 ..."
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="field-location" className="block text-[10px] tracking-[0.2em] uppercase opacity-70">
                  Project Location *
                </label>
                <input
                  id="field-location"
                  type="text"
                  name="projectLocation"
                  required
                  value={formData.projectLocation}
                  onChange={handleChange}
                  placeholder="e.g. Lagos, Nigeria"
                  className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="field-budget" className="block text-[10px] tracking-[0.2em] uppercase opacity-70">
                Budget
              </label>
              <input
                id="field-budget"
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. ₦500,000 - ₦1,000,000"
                className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="field-brief" className="block text-[10px] tracking-[0.2em] uppercase opacity-70">
                Project Brief *
              </label>
              <textarea
                id="field-brief"
                name="projectBrief"
                required
                rows={4}
                value={formData.projectBrief}
                onChange={handleChange}
                placeholder="Describe your project, references, key deliverables, and dates..."
                className="w-full bg-transparent border-b border-[#111111]/30 dark:border-[#FEFDF3]/30 py-2.5 text-sm sm:text-base focus:border-[#111111] dark:focus:border-[#FEFDF3] focus:outline-none transition-colors rounded-none placeholder:opacity-30 resize-y"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 dark:text-red-400">{errorMsg}</p>
            )}

            <div className="pt-6">
              <button
                type="submit"
                id="btn-submit-booking"
                disabled={isSubmitting}
                className="group inline-flex items-center space-x-2 border border-current px-6 py-3 text-xs tracking-[0.24em] uppercase opacity-85 hover:opacity-100 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Submit Booking</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};
