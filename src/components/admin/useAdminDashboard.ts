import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { ProjectItem, SkillItem, WorkExperienceItem, EducationItem } from '../../types/portfolio';
import { AdminTab } from './AdminSidebar';
import { useAdminAnalytics } from './useAdminAnalytics';
import { useAdminSettings } from './useAdminSettings';

export function useAdminDashboard() {
  const {
    isAdminOpen,
    isAdminAuthenticated,
    candidateProfile,
    updateProfile,
    addProject,
    updateProject,
    skillCategories,
    addSkill,
    updateSkill,
    addWorkExperience,
    updateWorkExperience,
    addEducation,
    updateEducation,
    exportDataJson,
    importDataJson,
    resetToDefaults,
    changeAdminPin,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Profile Form State
  const [profileForm, setProfileForm] = useState(candidateProfile);
  useEffect(() => {
    setProfileForm(candidateProfile);
  }, [candidateProfile]);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{
    categoryIndex: number;
    skillIndex?: number;
    skill?: SkillItem;
  } | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expModalType, setExpModalType] = useState<'work' | 'edu'>('work');
  const [editingExpItem, setEditingExpItem] = useState<WorkExperienceItem | EducationItem | null>(null);

  // Analytics Real Logs hook
  const { realLogs, realSummary, refreshAnalyticsData, clearLogs } = useAdminAnalytics(
    isAdminOpen,
    isAdminAuthenticated
  );

  // PIN & Settings hook
  const settingsProps = useAdminSettings({
    changeAdminPin,
    exportDataJson,
    importDataJson,
    resetToDefaults,
    showToast,
  });

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    showToast("✅ Profil ma'lumotlari muvaffaqiyatli saqlandi!");
  };

  const handleClearLogs = () => {
    clearLogs();
    showToast('🧹 Real loglar tozalandi.');
  };

  const handleSaveProject = (data: Omit<ProjectItem, 'id'>, id?: string) => {
    if (id) {
      updateProject(id, data);
      showToast('✅ Loyiha yangilandi!');
    } else {
      addProject(data);
      showToast("✅ Yangi loyiha qo'shildi!");
    }
  };

  const handleSaveSkill = (skill: SkillItem) => {
    if (editingSkill) {
      if (typeof editingSkill.skillIndex === 'number') {
        updateSkill(editingSkill.categoryIndex, editingSkill.skillIndex, skill);
        showToast("✅ Ko'nikma yangilandi!");
      } else {
        addSkill(editingSkill.categoryIndex, skill);
        showToast("✅ Yangi ko'nikma qo'shildi!");
      }
    }
  };

  const handleSaveWork = (work: Omit<WorkExperienceItem, 'id'>, id?: string) => {
    if (id) {
      updateWorkExperience(id, work);
      showToast('✅ Ish tajribasi yangilandi!');
    } else {
      addWorkExperience(work);
      showToast("✅ Yangi ish tajribasi qo'shildi!");
    }
  };

  const handleSaveEdu = (edu: Omit<EducationItem, 'id'>, id?: string) => {
    if (id) {
      updateEducation(id, edu);
      showToast("✅ Ta'lim ma'lumoti yangilandi!");
    } else {
      addEducation(edu);
      showToast("✅ Yangi ta'lim qo'shildi!");
    }
  };

  return {
    activeTab,
    setActiveTab,
    toastMessage,
    showToast,
    profileForm,
    setProfileForm,
    handleProfileSave,
    isProjectModalOpen,
    setIsProjectModalOpen,
    editingProject,
    setEditingProject,
    isSkillModalOpen,
    setIsSkillModalOpen,
    editingSkill,
    setEditingSkill,
    isExpModalOpen,
    setIsExpModalOpen,
    expModalType,
    setExpModalType,
    editingExpItem,
    setEditingExpItem,
    ...settingsProps,
    realLogs,
    realSummary,
    refreshAnalyticsData,
    handleClearLogs,
    handleSaveProject,
    handleSaveSkill,
    handleSaveWork,
    handleSaveEdu,
    skillCategoryTitle: editingSkill ? skillCategories[editingSkill.categoryIndex]?.title : '',
  };
}
