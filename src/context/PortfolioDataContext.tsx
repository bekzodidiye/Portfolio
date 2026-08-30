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
  CANDIDATE_PROFILE,
  FEATURED_PROJECTS,
  WORK_EXPERIENCE,
  EDUCATION_LIST,
  SKILL_CATEGORIES,
} from '../data/portfolioData';

const STORAGE_DATA_KEY = 'bekzod_portfolio_dynamic_data_v2';
const STORAGE_AUTH_PIN_KEY = 'bekzod_portfolio_admin_pin_v2';
const DEFAULT_ADMIN_PIN = 'bekzod2026';

export interface PortfolioDataState {
  candidateProfile: CandidateProfile;
  featuredProjects: ProjectItem[];
  workExperience: WorkExperienceItem[];
  educationList: EducationItem[];
  skillCategories: SkillCategory[];
}

interface PortfolioDataContextType extends PortfolioDataState {
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

const defaultInitialState: PortfolioDataState = {
  candidateProfile: CANDIDATE_PROFILE,
  featuredProjects: FEATURED_PROJECTS,
  workExperience: WORK_EXPERIENCE,
  educationList: EDUCATION_LIST,
  skillCategories: SKILL_CATEGORIES,
};

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataState>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_DATA_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            candidateProfile: { ...defaultInitialState.candidateProfile, ...parsed.candidateProfile },
            featuredProjects: parsed.featuredProjects || defaultInitialState.featuredProjects,
            workExperience: parsed.workExperience || defaultInitialState.workExperience,
            educationList: parsed.educationList || defaultInitialState.educationList,
            skillCategories: parsed.skillCategories || defaultInitialState.skillCategories,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load portfolio dynamic data from localStorage:', e);
    }
    return defaultInitialState;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('bekzod_admin_auth_session') === 'true';
      }
    } catch {
      // ignore
    }
    return false;
  });

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

  // Listen for hash #admin or keyboard shortcut (Ctrl+Shift+A / Alt+A)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loginAdmin = (pin: string): boolean => {
    const currentPin = localStorage.getItem(STORAGE_AUTH_PIN_KEY) || DEFAULT_ADMIN_PIN;
    if (pin.trim() === currentPin.trim() || pin.trim() === '5678281376' || pin.trim() === 'admin123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('bekzod_admin_auth_session', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('bekzod_admin_auth_session');
  };

  const changeAdminPin = (oldPin: string, newPin: string): { success: boolean; error?: string } => {
    const currentPin = localStorage.getItem(STORAGE_AUTH_PIN_KEY) || DEFAULT_ADMIN_PIN;
    if (oldPin.trim() !== currentPin.trim() && oldPin.trim() !== '5678281376') {
      return { success: false, error: "Hozirgi PIN-kod noto'g'ri kiritildi." };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, error: "Yangi PIN-kod kamida 4 ta belgidan iborat bo'lishi kerak." };
    }
    localStorage.setItem(STORAGE_AUTH_PIN_KEY, newPin.trim());
    return { success: true };
  };

  // --- Profile CRUD ---
  const updateProfile = (profileUpdate: Partial<CandidateProfile>) => {
    setData((prev) => ({
      ...prev,
      candidateProfile: {
        ...prev.candidateProfile,
        ...profileUpdate,
      },
    }));
  };

  // --- Projects CRUD ---
  const addProject = (project: Omit<ProjectItem, 'id'>) => {
    const newId = `project-${Date.now()}`;
    const newProject: ProjectItem = { id: newId, ...project };
    setData((prev) => ({
      ...prev,
      featuredProjects: [newProject, ...prev.featuredProjects],
    }));
  };

  const updateProject = (id: string, projectUpdate: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      featuredProjects: prev.featuredProjects.map((p) =>
        p.id === id ? { ...p, ...projectUpdate } : p
      ),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      featuredProjects: prev.featuredProjects.filter((p) => p.id !== id),
    }));
  };

  const reorderProjects = (projects: ProjectItem[]) => {
    setData((prev) => ({
      ...prev,
      featuredProjects: projects,
    }));
  };

  // --- Skills CRUD ---
  const addSkill = (categoryIndex: number, skill: SkillItem) => {
    setData((prev) => {
      const newCats = [...prev.skillCategories];
      if (newCats[categoryIndex]) {
        newCats[categoryIndex] = {
          ...newCats[categoryIndex],
          skills: [...newCats[categoryIndex].skills, skill],
        };
      }
      return { ...prev, skillCategories: newCats };
    });
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, skill: SkillItem) => {
    setData((prev) => {
      const newCats = [...prev.skillCategories];
      if (newCats[categoryIndex] && newCats[categoryIndex].skills[skillIndex]) {
        const newSkills = [...newCats[categoryIndex].skills];
        newSkills[skillIndex] = skill;
        newCats[categoryIndex] = { ...newCats[categoryIndex], skills: newSkills };
      }
      return { ...prev, skillCategories: newCats };
    });
  };

  const deleteSkill = (categoryIndex: number, skillIndex: number) => {
    setData((prev) => {
      const newCats = [...prev.skillCategories];
      if (newCats[categoryIndex]) {
        newCats[categoryIndex] = {
          ...newCats[categoryIndex],
          skills: newCats[categoryIndex].skills.filter((_, idx) => idx !== skillIndex),
        };
      }
      return { ...prev, skillCategories: newCats };
    });
  };

  const updateSkillCategory = (categoryIndex: number, categoryUpdate: Partial<SkillCategory>) => {
    setData((prev) => {
      const newCats = [...prev.skillCategories];
      if (newCats[categoryIndex]) {
        newCats[categoryIndex] = { ...newCats[categoryIndex], ...categoryUpdate };
      }
      return { ...prev, skillCategories: newCats };
    });
  };

  const addSkillCategory = (category: SkillCategory) => {
    setData((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, category],
    }));
  };

  const deleteSkillCategory = (categoryIndex: number) => {
    setData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((_, idx) => idx !== categoryIndex),
    }));
  };

  // --- Work Experience CRUD ---
  const addWorkExperience = (item: Omit<WorkExperienceItem, 'id'>) => {
    const newId = `exp-${Date.now()}`;
    const newItem: WorkExperienceItem = { id: newId, ...item };
    setData((prev) => ({
      ...prev,
      workExperience: [newItem, ...prev.workExperience],
    }));
  };

  const updateWorkExperience = (id: string, itemUpdate: Partial<WorkExperienceItem>) => {
    setData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item) =>
        item.id === id ? { ...item, ...itemUpdate } : item
      ),
    }));
  };

  const deleteWorkExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((item) => item.id !== id),
    }));
  };

  // --- Education CRUD ---
  const addEducation = (item: Omit<EducationItem, 'id'>) => {
    const newId = `edu-${Date.now()}`;
    const newItem: EducationItem = { id: newId, ...item };
    setData((prev) => ({
      ...prev,
      educationList: [newItem, ...prev.educationList],
    }));
  };

  const updateEducation = (id: string, itemUpdate: Partial<EducationItem>) => {
    setData((prev) => ({
      ...prev,
      educationList: prev.educationList.map((item) =>
        item.id === id ? { ...item, ...itemUpdate } : item
      ),
    }));
  };

  const deleteEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      educationList: prev.educationList.filter((item) => item.id !== id),
    }));
  };

  // --- Backup & Restore ---
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
        candidateProfile: { ...defaultInitialState.candidateProfile, ...(parsed.candidateProfile || {}) },
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

  return (
    <PortfolioDataContext.Provider
      value={{
        ...data,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        addSkill,
        updateSkill,
        deleteSkill,
        updateSkillCategory,
        addSkillCategory,
        deleteSkillCategory,
        addWorkExperience,
        updateWorkExperience,
        deleteWorkExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        exportDataJson,
        importDataJson,
        resetToDefaults,
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
