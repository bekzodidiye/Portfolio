export interface SkillItem {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
  tag?: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  description: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  timeline: string;
  techStack: string[];
  summary: string;
  keyFeatures: string[];
  architecture: string;
  githubUrl: string;
  demoUrl?: string;
  badge: string;
}

export interface WorkExperienceItem {
  id: string;
  role: string;
  companyOrPlatform: string;
  period: string;
  badge?: string;
  responsibilities: string[];
  techTags: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  period: string;
  field: string;
  status: string;
  description: string;
}

export interface CandidateProfile {
  name: string;
  primaryTitle: string;
  subTitle: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  telegramHandle: string;
  summary: string;
  freelanceCount: number;
}
