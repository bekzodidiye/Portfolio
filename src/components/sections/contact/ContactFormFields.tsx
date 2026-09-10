import React from 'react';

interface ContactFormFieldsProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  labels: {
    clientNameLabel: string;
    clientNamePlaceholder: string;
    emailInputLabel: string;
    emailInputPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
  };
}

export const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  name,
  setName,
  email,
  setEmail,
  message,
  setMessage,
  labels,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-name-input"
            className="block text-xs font-mono text-slate-700 mb-1.5 font-medium"
          >
            {labels.clientNameLabel}: <span className="text-blue-600 font-semibold">str</span>
          </label>
          <input
            id="contact-name-input"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={labels.clientNamePlaceholder}
            className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-base sm:text-xs text-slate-900 placeholder:text-slate-400 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email-input"
            className="block text-xs font-mono text-slate-700 mb-1.5 font-medium"
          >
            {labels.emailInputLabel}: <span className="text-blue-600 font-semibold">str</span>
          </label>
          <input
            id="contact-email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.emailInputPlaceholder}
            className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-base sm:text-xs text-slate-900 placeholder:text-slate-400 transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message-input"
          className="block text-xs font-mono text-slate-700 mb-1.5 font-medium"
        >
          {labels.messageLabel}: <span className="text-blue-600 font-semibold">str</span>
        </label>
        <textarea
          id="contact-message-input"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={labels.messagePlaceholder}
          className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-base sm:text-xs text-slate-900 placeholder:text-slate-400 transition-colors resize-none"
        />
      </div>
    </>
  );
};
