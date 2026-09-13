import React from 'react';
import { KeyRound, Download, Upload, AlertCircle, RotateCcw } from 'lucide-react';

interface AdminSettingsTabProps {
  onExport: () => void;
  importJsonText: string;
  setImportJsonText: (val: string) => void;
  onImport: () => void;
  onReset: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  onExport,
  importJsonText,
  setImportJsonText,
  onImport,
  onReset,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Sozlamalar, Zaxiralash va Xavfsizlik
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Parolni yangilash, ma'lumotlarni JSON formatda yuklab olish va qayta tiklash
        </p>
      </div>



      {/* Backup & Restore */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>To'liq Zaxira (JSON Backup & Restore)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold text-white">Eksport Qilish:</h4>
            <p className="text-xs text-slate-400">
              Barcha loyihalar, ko'nikmalar va profil ma'lumotlarini bitta .json faylga saqlab oling.
            </p>
            <button
              onClick={onExport}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Faylni Yuklab Olish (JSON)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-bold text-white">Import / Tiklash:</h4>
            <textarea
              rows={2}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="JSON matnini shu yerga qo'ying..."
              className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none"
            />
            <button
              onClick={onImport}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>JSON dan Tiklash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 rounded-3xl bg-rose-950/20 border border-rose-900/50 space-y-3">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Xavfli Hudud (Reset to Defaults)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Barcha o'zgartirilgan ma'lumotlarni o'chirib, saytni dastlabki holatga qaytaradi.
        </p>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Standart Holatga Qaytarish</span>
        </button>
      </div>
    </div>
  );
};
