import React from 'react';

export const ContactEnvViewer: React.FC = () => {
  return (
    <div
      id="contact-panel-env"
      role="tabpanel"
      className="font-mono text-xs text-slate-700 leading-relaxed space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar"
    >
      <p className="text-slate-400"># Production Environment Configuration & Gateway</p>
      <p className="break-all sm:break-normal">
        DEV_NAME=<span className="text-emerald-600 font-semibold">"Bekzod Idiyev"</span>
      </p>
      <p className="break-all sm:break-normal">
        PRIMARY_ROLE=<span className="text-blue-600 font-semibold">"Python Backend Developer"</span>
      </p>
      <p className="break-all sm:break-normal">
        LOCATION=<span className="text-slate-900 font-semibold">"Bukhara, Uzbekistan"</span>
      </p>
      <p className="break-all sm:break-normal">
        TELEGRAM_HANDLE=<span className="text-blue-600 font-semibold">"@toyneden"</span>
      </p>
      <p className="break-all sm:break-normal">
        EMAIL=<span className="text-indigo-600 font-semibold">"Bekzodidiye@gmail.com"</span>
      </p>
      <p className="break-all sm:break-normal">
        PHONE=<span className="text-amber-700 font-semibold">"+998 94 613 87 86"</span>
      </p>
      <p className="break-all sm:break-normal">
        GATEWAY_ENDPOINT=
        <span className="text-emerald-600 font-semibold">"https://api.telegram.org/bot[TOKEN]/sendMessage"</span>
      </p>
      <p className="break-all sm:break-normal">
        ACTIVE_STATUS=<span className="text-emerald-600 font-semibold">"AVAILABLE_FOR_CONTRACTS"</span>
      </p>
    </div>
  );
};
