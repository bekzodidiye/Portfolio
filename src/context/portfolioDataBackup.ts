import React from 'react';
import {
  PortfolioDataState,
  defaultInitialState,
  STORAGE_DATA_KEY,
} from './portfolioDataDefaults';

export function createBackupHandlers(
  data: PortfolioDataState,
  setData: React.Dispatch<React.SetStateAction<PortfolioDataState>>
) {
  const exportDataJson = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: "JSON formati noto'g'ri." };
      }
      setData({
        candidateProfile: {
          ...defaultInitialState.candidateProfile,
          ...(parsed.candidateProfile || {}),
        },
        featuredProjects: parsed.featuredProjects || defaultInitialState.featuredProjects,
        workExperience: parsed.workExperience || defaultInitialState.workExperience,
        educationList: parsed.educationList || defaultInitialState.educationList,
        skillCategories: parsed.skillCategories || defaultInitialState.skillCategories,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Faylni o'qishda xatolik yuz berdi." };
    }
  };

  const resetToDefaults = () => {
    setData(defaultInitialState);
    try {
      localStorage.removeItem(STORAGE_DATA_KEY);
    } catch {
      // ignore
    }
  };

  return {
    exportDataJson,
    importDataJson,
    resetToDefaults,
  };
}
