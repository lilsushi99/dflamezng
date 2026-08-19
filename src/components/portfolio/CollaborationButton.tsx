import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CollaborationButtonProps {
  onClick: () => void;
}

export const CollaborationButton: React.FC<CollaborationButtonProps> = ({ onClick }) => {
  return (
    <div className="flex items-center justify-center pt-2 sm:pt-3">
      <button
        id="btn-collaboration-form"
        onClick={onClick}
        className="group inline-flex items-center space-x-1.5 font-editorial-sans text-[10px] sm:text-[11px] tracking-[0.24em] uppercase opacity-75 hover:opacity-100 transition-all duration-200 cursor-pointer border-b border-current pb-0.5"
      >
        <span>Fill a Form</span>
        <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
};
