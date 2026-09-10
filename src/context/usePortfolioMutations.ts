import React from 'react';
import {
  CandidateProfile,
  ProjectItem,
  WorkExperienceItem,
  EducationItem,
  SkillCategory,
  SkillItem,
} from '../types/portfolio';
import { PortfolioDataState } from './portfolioDataDefaults';
import { createBackupHandlers } from './portfolioDataBackup';

export function usePortfolioMutations(
  data: PortfolioDataState,
  setData: React.Dispatch<React.SetStateAction<PortfolioDataState>>
) {
  // --- Profile CRUD ---
  const updateProfile = (profileUpdate: Partial<CandidateProfile>) => {
    setData((prev) => ({
      ...prev,
      candidateProfile: { ...prev.candidateProfile, ...profileUpdate },
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
    setData((prev) => ({ ...prev, featuredProjects: projects }));
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

  const backupHandlers = createBackupHandlers(data, setData);

  return {
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
    ...backupHandlers,
  };
}
