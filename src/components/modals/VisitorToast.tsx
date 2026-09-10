import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface VisitorToastProps {
  message: string | null;
  onClose: () => void;
}

export const VisitorToast: React.FC<VisitorToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-blue-500/30 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
        {message}
      </p>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-auto cursor-pointer"
        aria-label="Close message"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
