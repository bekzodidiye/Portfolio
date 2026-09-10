import {
  CandidateProfile,
  ProjectItem,
  WorkExperienceItem,
  EducationItem,
  SkillCategory,
} from '../types/portfolio';
import {
  CANDIDATE_PROFILE,
  FEATURED_PROJECTS,
  WORK_EXPERIENCE,
  EDUCATION_LIST,
  SKILL_CATEGORIES,
} from '../data/portfolioData';

export const STORAGE_DATA_KEY = 'bekzod_portfolio_dynamic_data_v2';
export const STORAGE_AUTH_PIN_KEY = 'bekzod_portfolio_admin_pin_v2';
export const DEFAULT_ADMIN_PIN = 'bekzod2026';

export interface PortfolioDataState {
  candidateProfile: CandidateProfile;
  featuredProjects: ProjectItem[];
  workExperience: WorkExperienceItem[];
  educationList: EducationItem[];
  skillCategories: SkillCategory[];
}

export const defaultInitialState: PortfolioDataState = {
  candidateProfile: CANDIDATE_PROFILE,
  featuredProjects: FEATURED_PROJECTS,
  workExperience: WORK_EXPERIENCE,
  educationList: EDUCATION_LIST,
  skillCategories: SKILL_CATEGORIES,
};

export function loadInitialPortfolioData(): PortfolioDataState {
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
}
