import React from 'react';
import { ShieldCheck, Check, Copy } from 'lucide-react';

interface JwtScenarioProps {
  jwtHeader: string;
  jwtPayload: string;
  jwtSecret: string;
  token: string;
  isTokenValid: boolean;
  copied: boolean;
  onPayloadChange: (val: string) => void;
  onSecretChange: (val: string) => void;
  onCopy: (text: string) => void;
}

export const JwtScenario: React.FC<JwtScenarioProps> = ({
  jwtHeader,
  jwtPayload,
  jwtSecret,
  token,
  isTokenValid,
  copied,
  onPayloadChange,
  onSecretChange,
  onCopy,
}) => {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Header (Alg & Typ) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-red-400 font-bold uppercase">1. Header (Algorithm)</span>
            <span className="text-slate-500">HS256</span>
          </div>
          <pre className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-red-300 font-mono text-xs overflow-x-auto min-h-[140px]">
            <code>{jwtHeader}</code>
          </pre>
        </div>

        {/* Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-400 font-bold uppercase">2. Payload (Claims)</span>
            <span className="text-slate-500">Edit below</span>
          </div>
          <textarea
            value={jwtPayload}
            onChange={(e) => onPayloadChange(e.target.value)}
            rows={5}
            className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500 min-h-[140px]"
          />
        </div>

        {/* Secret / Signature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase">3. Verify Signature</span>
            <span className="text-slate-500">HMAC Secret</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs space-y-2 min-h-[140px]">
            <input
              type="text"
              value={jwtSecret}
              onChange={(e) => onSecretChange(e.target.value)}
              className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-cyan-200 text-xs focus:outline-none"
              placeholder="Secret Key..."
            />
            <div className="flex items-center gap-2 pt-2 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className={isTokenValid ? 'text-emerald-400' : 'text-red-400'}>
                {isTokenValid ? 'Signature Verified (Valid)' : 'Invalid Signature'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Token Display */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 uppercase font-bold">Encrypted JWT Token:</span>
          <button
            onClick={() => onCopy(token)}
            className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Nusxalandi!" : "Nusxa olish"}</span>
          </button>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs break-all leading-relaxed">
          {token.split('.').map((part, i) => (
            <span
              key={i}
              className={i === 0 ? 'text-red-400 font-bold' : i === 1 ? 'text-purple-400' : 'text-cyan-400 font-semibold'}
            >
              {part}
              {i < 2 ? <span className="text-slate-600">.</span> : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
