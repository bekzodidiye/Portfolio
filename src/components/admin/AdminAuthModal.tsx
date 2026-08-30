import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, KeyRound, X, ArrowRight, AlertCircle } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

export const AdminAuthModal: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen, isAdminAuthenticated, loginAdmin } = usePortfolioData();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isAdminOpen || isAdminAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Iltimos, admin PIN-kodini kiriting.');
      return;
    }

    const success = loginAdmin(pin);
    if (success) {
      setError('');
      setPin('');
    } else {
      setError("Noto'g'ri PIN-kod! Iltimos, qaytadan urinib ko'ring.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleQuickKey = (digit: string) => {
    if (pin.length < 16) {
      setPin((prev) => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminOpen(false)}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: isShaking ? [-10, 10, -10, 10, 0] : 0,
          }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-slate-900/95 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10 text-white overflow-hidden"
        >
          {/* Neon Glow Aura */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Admin Boshqaruv Markazi
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Portfolioni to'liq boshqarish uchun maxfiy PIN-kodni kiriting
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  autoFocus
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  placeholder="PIN-kodni kiriting (Standart: bekzod2026)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-white placeholder-slate-500 text-sm font-mono tracking-widest outline-none transition-all"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 px-1 font-medium"
                >
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>

            {/* Quick Digital Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === 'C') setPin('');
                    else if (k === '⌫') handleBackspace();
                    else handleQuickKey(k);
                  }}
                  className="py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/40 text-sm font-semibold text-slate-200 hover:text-white transition-all active:scale-95"
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-semibold text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>Kirish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-5 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Standart PIN: <code className="text-blue-400 bg-blue-950/50 px-1.5 py-0.5 rounded">bekzod2026</code></span>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
