import React from 'react';
import { ProjectItem, SkillItem, WorkExperienceItem, EducationItem } from '../../types/portfolio';
import { CandidateProfile } from '../../types/portfolio';
import { RealVisitorRecord, RealAnalyticsSummary } from '../../services/realVisitorStorage';
import { AdminTab } from './AdminSidebar';

import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminProfileTab } from './tabs/AdminProfileTab';
import { AdminProjectsTab } from './tabs/AdminProjectsTab';
import { AdminSkillsTab } from './tabs/AdminSkillsTab';
import { AdminTimelineTab } from './tabs/AdminTimelineTab';
import { AdminAnalyticsTab } from './tabs/AdminAnalyticsTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';

interface AdminTabRouterProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  profileForm: CandidateProfile;
  setProfileForm: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  handleProfileSave: (e: React.FormEvent) => void;
  setEditingProject: (project: ProjectItem | null) => void;
  setIsProjectModalOpen: (open: boolean) => void;
  setEditingSkill: (skill: { categoryIndex: number; skillIndex?: number; skill?: SkillItem } | null) => void;
  setIsSkillModalOpen: (open: boolean) => void;
  setExpModalType: (type: 'work' | 'edu') => void;
  setEditingExpItem: (item: WorkExperienceItem | EducationItem | null) => void;
  setIsExpModalOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
  realLogs: RealVisitorRecord[];
  realSummary: RealAnalyticsSummary;
  refreshAnalyticsData: () => Promise<void>;
  handleClearLogs: () => void;
  handleExport: () => void;
  importJsonText: string;
  setImportJsonText: (text: string) => void;
  handleImport: () => void;
  handleReset: () => void;
}

export const AdminTabRouter: React.FC<AdminTabRouterProps> = ({
  activeTab,
  setActiveTab,
  profileForm,
  setProfileForm,
  handleProfileSave,
  setEditingProject,
  setIsProjectModalOpen,
  setEditingSkill,
  setIsSkillModalOpen,
  setExpModalType,
  setEditingExpItem,
  setIsExpModalOpen,
  showToast,
  realLogs,
  realSummary,
  refreshAnalyticsData,
  handleClearLogs,
  handleExport,
  importJsonText,
  setImportJsonText,
  handleImport,
  handleReset,
}) => {
  if (activeTab === 'overview') {
    return (
      <AdminOverviewTab
        onOpenNewProject={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        onGoToProfile={() => setActiveTab('profile')}
        onExport={handleExport}
      />
    );
  }

  if (activeTab === 'profile') {
    return (
      <AdminProfileTab
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        onSave={handleProfileSave}
      />
    );
  }

  if (activeTab === 'projects') {
    return (
      <AdminProjectsTab
        onNewProject={() => {
          setEditingProject(null);
          setIsProjectModalOpen(true);
        }}
        onEditProject={(p) => {
          setEditingProject(p);
          setIsProjectModalOpen(true);
        }}
        showToast={showToast}
      />
    );
  }

  if (activeTab === 'skills') {
    return (
      <AdminSkillsTab
        onAddSkill={(catIdx) => {
          setEditingSkill({ categoryIndex: catIdx });
          setIsSkillModalOpen(true);
        }}
        onEditSkill={(catIdx, sIdx, skill) => {
          setEditingSkill({ categoryIndex: catIdx, skillIndex: sIdx, skill });
          setIsSkillModalOpen(true);
        }}
        showToast={showToast}
      />
    );
  }

  if (activeTab === 'timeline') {
    return (
      <AdminTimelineTab
        onAddWork={() => {
          setExpModalType('work');
          setEditingExpItem(null);
          setIsExpModalOpen(true);
        }}
        onEditWork={(work) => {
          setExpModalType('work');
          setEditingExpItem(work);
          setIsExpModalOpen(true);
        }}
        onAddEdu={() => {
          setExpModalType('edu');
          setEditingExpItem(null);
          setIsExpModalOpen(true);
        }}
        onEditEdu={(edu) => {
          setExpModalType('edu');
          setEditingExpItem(edu);
          setIsExpModalOpen(true);
        }}
        showToast={showToast}
      />
    );
  }

  if (activeTab === 'analytics') {
    return (
      <AdminAnalyticsTab
        realLogs={realLogs}
        realSummary={realSummary}
        onRefreshLogs={refreshAnalyticsData}
        onClearLogs={handleClearLogs}
      />
    );
  }

  if (activeTab === 'settings') {
    return (
      <AdminSettingsTab
        onExport={handleExport}
        importJsonText={importJsonText}
        setImportJsonText={setImportJsonText}
        onImport={handleImport}
        onReset={handleReset}
      />
    );
  }

  return null;
};
