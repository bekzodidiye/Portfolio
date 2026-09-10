import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CandidateProfile,
  ProjectItem,
  WorkExperienceItem,
  EducationItem,
  SkillCategory,
  SkillItem,
} from '../types/portfolio';
import {
  PortfolioDataState,
  loadInitialPortfolioData,
  STORAGE_DATA_KEY,
} from './portfolioDataDefaults';
import { usePortfolioAuth } from './usePortfolioAuth';
import { usePortfolioMutations } from './usePortfolioMutations';

export type { PortfolioDataState };

export interface PortfolioDataContextType extends PortfolioDataState {
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPin: (oldPin: string, newPin: string) => { success: boolean; error?: string };
  // Profile
  updateProfile: (profile: Partial<CandidateProfile>) => void;
  // Projects
  addProject: (project: Omit<ProjectItem, 'id'>) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projects: ProjectItem[]) => void;
  // Skills
  addSkill: (categoryIndex: number, skill: SkillItem) => void;
  updateSkill: (categoryIndex: number, skillIndex: number, skill: SkillItem) => void;
  deleteSkill: (categoryIndex: number, skillIndex: number) => void;
  updateSkillCategory: (categoryIndex: number, category: Partial<SkillCategory>) => void;
  addSkillCategory: (category: SkillCategory) => void;
  deleteSkillCategory: (categoryIndex: number) => void;
  // Experience
  addWorkExperience: (item: Omit<WorkExperienceItem, 'id'>) => void;
  updateWorkExperience: (id: string, item: Partial<WorkExperienceItem>) => void;
  deleteWorkExperience: (id: string) => void;
  // Education
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  // Backup & Restore
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataState>(loadInitialPortfolioData);

  // Save changes to localStorage on data update
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(data));
      }
    } catch (e) {
      console.warn('Failed to persist portfolio data:', e);
    }
  }, [data]);

  const auth = usePortfolioAuth();
  const mutations = usePortfolioMutations(data, setData);

  return (
    <PortfolioDataContext.Provider
      value={{
        ...data,
        ...auth,
        ...mutations,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
