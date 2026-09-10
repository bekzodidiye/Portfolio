import React from 'react';
import { Check } from 'lucide-react';

interface ContactSuccessViewProps {
  title: string;
  message: string;
  sendAnotherText: string;
  onReset: () => void;
}

export const ContactSuccessView: React.FC<ContactSuccessViewProps> = ({
  title,
  message,
  sendAnotherText,
  onReset,
}) => {
  return (
    <div
      id="contact-panel-py"
      role="tabpanel"
      className="p-6 sm:p-8 text-center rounded-xl bg-emerald-50 border border-emerald-200 animate-fadeIn"
    >
      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Check className="w-7 h-7" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
        {message}
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white border border-slate-300 hover:border-blue-500 text-slate-800 shadow-sm transition-all cursor-pointer active:scale-95"
      >
        {sendAnotherText}
      </button>
    </div>
  );
};
