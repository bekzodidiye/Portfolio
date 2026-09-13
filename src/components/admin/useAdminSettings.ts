import React, { useState } from 'react';

interface UseAdminSettingsOptions {
  exportDataJson: () => string;
  importDataJson: (json: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
  showToast: (msg: string) => void;
}

export function useAdminSettings({
  exportDataJson,
  importDataJson,
  resetToDefaults,
  showToast,
}: UseAdminSettingsOptions) {
  const [importJsonText, setImportJsonText] = useState('');

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bekzod_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Zaxira fayli (JSON) muvaffaqiyatli yuklab olindi!');
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const res = importDataJson(importJsonText);
    if (res.success) {
      showToast("📤 Barcha ma'lumotlar muvaffaqiyatli tiklandi!");
      setImportJsonText('');
    } else {
      showToast(`⚠️ Xatolik: ${res.error}`);
    }
  };

  const handleReset = () => {
    if (window.confirm("Haqiqatan ham barcha ma'lumotlarni dastlabki holatga qaytarmoqchimisiz?")) {
      resetToDefaults();
      showToast("🔄 Barcha ma'lumotlar standart holatga qaytarildi!");
    }
  };

  return {
    importJsonText,
    setImportJsonText,
    handleExport,
    handleImport,
    handleReset,
  };
}
