import React from 'react';
import { Save } from 'lucide-react';
import { CandidateProfile } from '../../../types/portfolio';

interface AdminProfileTabProps {
  profileForm: CandidateProfile;
  setProfileForm: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  onSave: (e: React.FormEvent) => void;
}

export const AdminProfileTab: React.FC<AdminProfileTabProps> = ({
  profileForm,
  setProfileForm,
  onSave,
}) => {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Profil va Shaxsiy Ma'lumotlar
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Ism, kasbiy unvonlar, aloqa ma'lumotlari va bio tavsifini o'zgartiring
        </p>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">To'liq Ism *</label>
            <input
              type="text"
              required
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Asosiy Kasbiy Unvon *</label>
            <input
              type="text"
              required
              value={profileForm.primaryTitle}
              onChange={(e) => setProfileForm({ ...profileForm, primaryTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ikkilamchi Unvon / Ta'lim</label>
            <input
              type="text"
              value={profileForm.subTitle}
              onChange={(e) => setProfileForm({ ...profileForm, subTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Joylashuv (Location)</label>
            <input
              type="text"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefon Raqami</label>
            <input
              type="text"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Manzili</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Frilans Loyihalar Soni</label>
            <input
              type="number"
              value={profileForm.freelanceCount}
              onChange={(e) => setProfileForm({ ...profileForm, freelanceCount: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telegram Username</label>
            <input
              type="text"
              value={profileForm.telegramHandle}
              onChange={(e) => setProfileForm({ ...profileForm, telegramHandle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telegram Bot Username</label>
            <input
              type="text"
              value={profileForm.botUsername || ''}
              onChange={(e) => setProfileForm({ ...profileForm, botUsername: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub URL</label>
            <input
              type="text"
              value={profileForm.github}
              onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio / Kasbiy Summary *</label>
          <textarea
            rows={4}
            required
            value={profileForm.summary}
            onChange={(e) => setProfileForm({ ...profileForm, summary: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="pt-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Profil O'zgarishlarini Saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};
