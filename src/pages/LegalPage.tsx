import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  title: string;
  content: string;
  onNavigateHome: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ title, content, onNavigateHome }) => {
  useEffect(() => {
    document.title = `${title} — Gold Akingbade`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <main className="min-h-screen w-full bg-[#FEFDF3] dark:bg-[#111111] text-[#111111] dark:text-[#FEFDF3] transition-colors duration-400 px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-20 sm:pb-32">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onNavigateHome}
          className="group inline-flex items-center space-x-2 opacity-75 hover:opacity-100 transition-opacity cursor-pointer mb-10 font-editorial-sans text-xs tracking-[0.22em] uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Home</span>
        </button>

        <h1 className="font-editorial-serif font-light text-3xl sm:text-4xl md:text-5xl tracking-tight mb-8">
          {title}
        </h1>

        <div className="font-editorial-sans text-sm leading-relaxed opacity-80 whitespace-pre-line space-y-4">
          {content}
        </div>
      </div>
    </main>
  );
};
